import autobind from 'autobind-decorator'

import Person from './Person'
import store from '../store'
import { connect } from '../utils/connect';
import PersonBase from './PersonBase';
import { LayersIds } from '../constants/constants';


import '../assets/clerk/clerk.png'

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

const mapStateToProps = (state = store.getState()) => {
    return {
        state: state
    }
}   

// @connect(mapStateToProps, null)

export class Passer extends PersonBase {
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
            y: game.world.height - 50,
            key: key,
            speed: speed,
            time_threshold: TIME_THRESHOLD,
        });
        
        this.game = game;

        // custom logic for sprite
        this.sprite.scale.setTo(0.12, 0.12)
        this.sprite.anchor.set(0.5, 1)
        this.sprite.animations.add('stand', [0], 20, true);
        this.animationRun = this.sprite.animations.add('move', [0, 1, 2, 3], 8, true)
        this.sprite.animations.play('stand')
        this.game.debug.body(this.sprite)
    }

    render() {

    }
}


export const renderPassers = (game: Phaser.Game) => {

    const passers = PASSER_COORDS.map((PASSER_COORD) => {
        return new Passer(game, PASSER_COORD, PASSER_SPEED, LayersIds.clerk)
    })

    return {
        sprites: passers.map((p) => p.sprite),
        instances: passers,
        update: () => passers.forEach((inst: Passer) => inst.update())
    }
} 


