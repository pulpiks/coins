import autobind from 'autobind-decorator'

import Person from './Person'
import store from '../store'
import { connect } from '../utils/connect';
import PersonBase from './PersonBase';
import { LayersIds, passers, PasserConstantType, passersConstants, PasserConstantOptions } from '../constants/constants';


import '../assets/clerk/clerk.png'
import { collideOfficial, changeMoney, collidePasser } from '../actions';
import { deepFlatten } from '../utils';

type COORD = {
    readonly x: number
}

type SPEED = {
    readonly min: number,
    readonly max: number,
}

const AMOUNT_FUNDRISING = 10

const PASSER_SPEED = {
    min: 15,
    max: 30
}

const TIME_THRESHOLD = 2000

const mapStateToProps = (state = store.getState()) => {
    return {
        state: state
    }
}   

// @connect(mapStateToProps, null)

export class Passer extends PersonBase {
    game: Phaser.Game
    sprite: Phaser.Sprite
    key: string

    constructor( 
        game: Phaser.Game, 
        coord: COORD,
        speed: SPEED,
        key: string,
        passerConfig: PasserConstantOptions
    ) {
        super({
            game: game,
            x: game.rnd.between(100, coord.x),
            y: game.world.height - 50,
            key: key,
            speed: speed,
            time_threshold: TIME_THRESHOLD,
            velocity: {
                min: 5,
                max: 8,
            }
        });
        
        this.game = game;
        this.key = key
        // custom logic for sprite
        // this.sprite.body.setSize(326)
        this.sprite.scale.setTo(passerConfig.setTo[0], passerConfig.setTo[1])
        this.sprite.anchor.set(0.5, 1)
        this.sprite.animations.add('stand', passerConfig.stand.frames, passerConfig.stand.frameRate, true);
        this.animationRun = this.sprite.animations.add('move', passerConfig.move.frames, passerConfig.move.frameRate, true)
        this.sprite.animations.play('stand')
        this.game.debug.body(this.sprite)
    }

    render() {}
}


export interface PassersProps {
    sprites: Phaser.Sprite[],
    instances: Passer[],
    update: any,
    collisionWithPerson: (sprite: Phaser.Sprite) => any
}

export const renderPassers = (game: Phaser.Game): PassersProps => {
    // const passerInstances: Passer[] = []
    const passerInstances: Passer[][] = passers.map((passer) => {
        const arr = []
        if (passer.count > 0) {
            for(let i=0; i<passer.count; i++) {
                arr.push(new Passer(
                    game, 
                    {
                        x: game.rnd.between(100, game.world.width - 300)
                    }, 
                    PASSER_SPEED, 
                    `${LayersIds.passer}-${passer.key}`,
                    passersConstants[passer.key]
                ))
            }
        }
        return arr
    })

    const instances = deepFlatten<any>(passerInstances)

    return {
        sprites: instances.map((p) => p.sprite),
        instances,
        update: () => instances.forEach((inst: Passer) => inst.update()),
        collisionWithPerson: (sprite) => {
            const instance = instances.find(p => p.sprite === sprite)
            const state = store.getState()
            if (state.passers.collided.indexOf(instance.key) < 0) {
                store.dispatch(collidePasser(instance.key))
                store.dispatch(changeMoney(AMOUNT_FUNDRISING))
            }
        }
    }
} 


