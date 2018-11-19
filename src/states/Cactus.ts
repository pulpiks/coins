import autobind from 'autobind-decorator';
import store from '../store';
import { addCactus } from '../actions';
import { sampleSize, isDevelopment } from '../utils';
import { PubSub } from './Pubsub';


interface CactusProps {
    readonly game: Phaser.Game
    readonly x: number
    readonly y: number
    readonly key?: string
}

interface CactusProp extends Phaser.Sprite {
    isKilled?: boolean
}

export const CACTUS = {
    width: 25,
    height: 30,
}

const CACTUS_COORDS = [{x: 200, y: 100}, {x: 300, y: 100}, {x: 580, y: 100}, {x: 540, y: 500}, {x: 600, y: 800}]

export class Cactus {
    cactus: Phaser.Sprite

    constructor({
        game, 
        x, 
        y, 
        key = 'cactus'
    }: CactusProps) {
        this.cactus = game.add.sprite(
            x,
            y,
            key
        );
        game.physics.arcade.enable(this.cactus);
        this.cactus.width = CACTUS.width;
        this.cactus.height = CACTUS.height;
        this.cactus.body.immovable = true;
        this.cactus.body.allowGravity = false;
        this.cactus.body.collideWorldBounds = true;
        this.cactus.body.onWorldBounds = new Phaser.Signal();
        this.cactus.body.onWorldBounds.add(this.hitWorldBounds, this);
    }

    hitWorldBounds() {
        this.cactus.destroy();
    }
}

export interface ThrowCactusProps {
    readonly x:number, 
    readonly y:number, 
    readonly velocityX: number, 
    readonly angularVelocity: number
}


export interface CactusHanlerProps {
    readonly cactuses: Phaser.Group
    readonly thrownCactuses: CactusProp[] 
    readonly update: () => any
    readonly instances: Cactus[]
    readonly collidePolicemanWithCactus: (cactus: CactusProp)=> any
    readonly collidePersonWithCactus: (cactus: Phaser.Sprite) => any
}


export const CactusHandler = (game: Phaser.Game): CactusHanlerProps => {
    const cactuses = game.add.physicsGroup(Phaser.Physics.ARCADE);
    const arrFromCoords = isDevelopment ? CACTUS_COORDS : sampleSize(CACTUS_COORDS, Math.floor(Math.random() * CACTUS_COORDS.length))
    const instances: Cactus[] = []   
    const thrownCactuses: CactusProp[] = [] 
    arrFromCoords.forEach((coord) => {
        let instance = new Cactus({
            game: game,
            x: coord.x/*Math.floor(Math.random() * (game.world.width - 100)) + 100*/,
            y: game.height - 50 - coord.y,
        })
        instances.push(instance)
    
        cactuses.add(instance.cactus)
    })


    const throwCactus = (props: ThrowCactusProps) => {
        const {x,y,velocityX,angularVelocity} = props
        const cactus = thrownCactuses[thrownCactuses.length-1];
        cactus.revive();
        cactus.body.x = x;
        cactus.body.y = y;
        cactus.body.velocity.x = velocityX;
        cactus.body.velocity.y = 0;
        cactus.body.angularVelocity = angularVelocity;
        cactus.body.allowGravity = true
        cactus.body.gravity.y = 100
    }

    PubSub.subscribe(throwCactus)
    const methods = {
        instances,
        thrownCactuses,
        cactuses,
        update: function() {
            cactuses.forEachAlive((cactus: Phaser.Sprite) => {
                game.debug.body(cactus);
            }, this);
            cactuses.forEach((cactus: CactusProp) => {
                if (!cactus.alive && cactus.isKilled){
                    cactus.destroy();
                }
            }, this);
        },
        collidePolicemanWithCactus: function(cactus: CactusProp) {
            thrownCactuses.pop();
            cactus.kill();
            cactus.isKilled = true;
        },
        // collideObstaclesWithCactus: (obstacle: Phaser.Sprite) => {
        //     const cactus = thrownCactuses.pop();
        //     cactus.kill();
        //     cactus.isKilled = true;
        // },
        collidePersonWithCactus: function(cactus: Phaser.Sprite) {
            cactus.kill()
            thrownCactuses.push(cactus)
            store.dispatch(addCactus())
        },
    }
    return methods
}
