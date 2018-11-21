import autobind from 'autobind-decorator'

import Person from './Person'
import store from '../store'
import { connect } from '../utils/connect';
import PersonBase from './PersonBase';
import { LayersIds } from '../constants/constants';


import '../assets/clerk/clerk.png'
import { collideOfficial, changeMoney } from '../actions';

type COORD = {
    readonly x: number
}

type SPEED = {
    readonly min: number,
    readonly max: number,
}

const PASSER_COORDS: COORD[] = [{
    x: 100,
}, {
    x: 200,
}, {
    x: 300
}]

const PASSER_SPEED = {
    min: 10,
    max: 30
}

const TIME_THRESHOLD = 2000
const PENALTY_IN_COLLISION_WITH_OFFICIAL = -1

const mapStateToProps = (state = store.getState()) => {
    return {
        state: state
    }
}   

// @connect(mapStateToProps, null)

export class Official extends PersonBase {
    game: Phaser.Game
    sprite: Phaser.Sprite

    constructor( 
        game: Phaser.Game, 
        coord: COORD,
        speed: SPEED,
        key: string
    ) {
        super({
            game: game,
            x: game.rnd.between(100, coord.x),
            y: game.world.height - 48,
            key: key,
            speed: speed,
            time_threshold: TIME_THRESHOLD,
            velocity: {
                min: 5,
                max: 8,
            }
        })
        this.game = game;

        // custom logic for sprite
        this.sprite.scale.setTo(0.09, 0.085)
        this.sprite.anchor.set(0.5, 1)
        this.sprite.animations.add('stand', [2], 8, true);
        this.animationRun = this.sprite.animations.add('move', [3, 2, 1, 0], 8, true)
        this.sprite.animations.play('stand')
        this.game.debug.body(this.sprite)
    }

    render() {

    }
}


export interface OfficialProps {
    sprites: Phaser.Sprite[],
    instances: Official[],
    update: any,
    collisionWithPerson: (sprite: Phaser.Sprite) => any
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
        }
    }
} 


