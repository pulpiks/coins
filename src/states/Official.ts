
import store from '../store'
import PersonBase from './PersonBase';
import { LayersIds, ground, ENEMY_TYPES } from '../constants/constants';


import '../assets/clerk/clerk.png'
import { collideOfficial, changeMoney } from '../actions';
import Enemy from './Enemy';

type COORD = {
    readonly x: number
}

type SPEED = {
    readonly min: number,
    readonly max: number,
}

const PASSER_COORDS: COORD[] = [{
    x: 600,
}, {
    x: 900,
}, {
    x: 2000
}, {
    x: 700,
}, {
    x: 950,
}, {
    x: 1000
}]

const PASSER_SPEED = {
    min: 10,
    max: 30
}

const TIME_THRESHOLD = 2000
const PENALTY_IN_COLLISION_WITH_OFFICIAL = -5

export const OFFICIAL_SPRITE_INFO = {
    setTo: [0.09, 0.085],
    stand: {
        frames: [2],
        frameRate: 8,
    }, 
    move: {
        frames: [3, 2, 1, 0],
        frameRate: 8
    }
}

export class Official extends Enemy {
    game: Phaser.Game
    sprite: Phaser.Sprite

    constructor( 
        game: Phaser.Game, 
        coord: COORD,
        speed: SPEED,
        key: string
    ) {
        super({
            // game: game,
            // x: game.rnd.between(100, coord.x),
            // y: game.world.height - ground.height,
            // key: key,
            // speed: speed,
            // time_threshold: TIME_THRESHOLD,
            // velocity: {
            //     min: 5,
            //     max: 8,
            // }
            game, 
            coord: {
                x: game.rnd.between(100, coord.x)
            }, 
            speed: {
                min: speed.min,
                max: speed.max,
            }, 
            key,
            spriteOptions: OFFICIAL_SPRITE_INFO,
            type: ENEMY_TYPES.official,
            time_threshold: TIME_THRESHOLD,
            time_disabled: TIME_THRESHOLD,
        })
        
    }

    render() {

    }
}


export interface OfficialProps {
    sprites: Phaser.Sprite[],
    instances: Official[],
    update: any,
    collisionWithPerson: (sprite: Phaser.Sprite) => any
    collideWithObstacles: (sprite: Phaser.Sprite) => any
    collideCactus: (sprite: Phaser.Sprite) => any
}

export const renderOfficials = (game: Phaser.Game): OfficialProps => {

    const passers = PASSER_COORDS.map((PASSER_COORD) => {
        return new Official(game, PASSER_COORD, PASSER_SPEED, LayersIds.clerk)
    })

    return {
        sprites: passers.map((p) => p.sprite),
        instances: passers,
        update: () => passers.forEach((inst: Official) => inst.update()),
        collisionWithPerson: (sprite) => {
            const id = passers.findIndex(p => p.sprite === sprite)
            const state = store.getState()
            if (state.official.collided.indexOf(id) < 0) {
                store.dispatch(collideOfficial(id))
                store.dispatch(changeMoney(PENALTY_IN_COLLISION_WITH_OFFICIAL))
            }
        },
        collideWithObstacles: function(sprite) {
            const official = passers.find(p => p.sprite === sprite)
            official.collideWithObstacles()
        },
        collideCactus: function(sprite) {
            const official = passers.find(p => p.sprite === sprite)
            official.onCactusCollision()
        },
    }
} 


