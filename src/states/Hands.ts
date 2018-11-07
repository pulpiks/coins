import autobind from 'autobind-decorator'

import store from '../store'

import {
    LayersIds, HANDS, HANDS_COORDS
} from '../constants/constants'

import { throwCactus, changeMoney, reduceMood } from '../actions'
import Person from './Person';
import { getRandom } from '../utils';

const MIN_DISTANCE_TO_APROACH = 50

interface HandsProps {
    readonly game: Phaser.Game,
    readonly x: number,
    readonly y: number,
}

export class Hands extends Person {
    readonly game: Phaser.Game
    readonly tween: Phaser.Tween
    isShown: boolean = false
    isFirstCall: boolean = true
    constructor( {
        game, 
        x,
        y
    }: HandsProps) {
        super({
            game: game,
            x: x,
            y: game.world.height - y - 10,
            key: LayersIds.hands
        })

        this.game = game

        this.sprite.width = HANDS.width
        this.sprite.height = HANDS.height
        this.sprite.alpha = 0
        this.tween = this.game.add.tween(this.sprite).to(
            { alpha: 1,
              y: this.sprite.y + 10,
             },
            0, 
            Phaser.Easing.Linear.None, 
            false, 
            0, 
            -1, 
            true
        )

    }

    show() {
        this.sprite.alpha = 1
        // if (!this.isShown) {
            // this.isShown = true
            if (this.isFirstCall) {
                this.isFirstCall = false
                this.tween.start()
            } else {
                this.tween.resume()
            }
        // }
    }

    hide() {
        // if (this.isShown) {
            // this.isShown = false
            this.sprite.alpha = 0
            this.tween.stop()
        // }
    }

    touchPerson() {

    }
}

export class HandsHandler {
    readonly hands: Hands[]
    readonly handsX: number[]
    constructor(game: Phaser.Game) {
        this.handsX = HANDS_COORDS.map(coord => coord[0])
        this.hands = HANDS_COORDS.map((handCoord) => {
            return new Hands({
                game,
                x: handCoord[0],
                y: handCoord[1]
            })
        })

    }

    update(x: number) {
        const state = store.getState()
        // const {personCoords} = state
        const handIndexes = HANDS_COORDS.reduce((res, coord, i) => {
            if (Math.abs(coord[0] - x) < MIN_DISTANCE_TO_APROACH) 
                res.push(i)
            return res    
        }, []) 


        this.hands.forEach((_, i) => {
            const index = handIndexes.find(handIndex => handIndex === i)
            if (index >=0 ) {
                const showHands = getRandom()
                if (showHands) {
                    console.log(showHands)
                    console.log(showHands)
                    this.hands[index].show()
                }
            } else {
                this.hands[i].hide()
            }
        })
    }
}