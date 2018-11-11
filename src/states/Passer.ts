import autobind from 'autobind-decorator'

import Person from './Person'
import store from '../store'
import { connect } from '../utils/connect';
import PersonBase from './PersonBase';
import { LayersIds } from '../constants/constants';

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
        this.animationRun = this.sprite.animations.add('move', [7, 6, 5, 4], 8, true)
    }

    render() {

    }
}


export const renderPassers = (game: Phaser.Game) => {

    const passers = PASSER_COORDS.map((PASSER_COORD) => {
        return new Passer(game, PASSER_COORD, PASSER_SPEED, 'passer')
    })

    return {
        sprites: passers.map((p) => p.sprite),
        instances: passers,
        update: this.instances.map((inst: Passer) => inst.update())
    }
} 


