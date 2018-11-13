import autobind from 'autobind-decorator'
import throttle from 'lodash.throttle'

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
    readonly tweenVisible: Phaser.Tween
    readonly tweenHidden: Phaser.Tween
    isVisible: boolean = false
    isFirstCall: boolean = true
    isFirstCallHidden: boolean = true
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
        this.sprite.body.immovable = true
        this.sprite.body.moves = true
        this.sprite.body.enable = true
        this.update = throttle(this.update, 5000)
        
        this.tweenVisible = this.game.add.tween(this.sprite).to(
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

        this.tweenHidden = this.game.add.tween(this.sprite).to(
            { alpha: 0,
              y: this.sprite.y - 10,
             },
            0, 
            Phaser.Easing.Linear.None, 
            false, 
            0, 
            0, 
            true
        )
    }

    show() {
        if (this.isVisible) {
            return ;
        }
        this.isVisible = true
        this.tweenHidden.stop()
        if (this.isFirstCall) {
            this.isFirstCall = false
            this.tweenVisible.start()
        } else {
            this.tweenVisible.resume()
        }
    }

    hide() {
        if (!this.isVisible) {
            return ;
        }
        this.isVisible = false
        this.tweenVisible.stop()
        if (this.isFirstCallHidden) {
            this.isFirstCallHidden = false
            this.tweenHidden.start()
        } else {
            this.tweenHidden.resume()
        }
    }

    touchPerson() {

    }

    update() {
        if (+this.sprite.alpha > 0) {
            store.dispatch(changeMoney(-5))
        } 
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
        this.update = throttle(this.update, 5000)
    }

    getHandsSprite() {
        return this.hands.map((hand) => hand.sprite)
    }

    collidePerson(sprite: Phaser.Sprite) {
        const hand = this.hands.find(hand => hand.sprite === sprite)
        hand.update()
    }

    update(x: number) {
        // const {personCoords} = state
        console.log('call udpate')
        const handIndexes = HANDS_COORDS.reduce((res, coord, i) => {
            if (Math.abs(this.hands[i].sprite.centerX - x) < MIN_DISTANCE_TO_APROACH) 
                res.push(i)
            return res    
        }, []) 

        this.hands.forEach((_, i) => {
            const index = handIndexes.find(handIndex => handIndex === i)
            if (index >=0 ) {
                const showHands = getRandom()
                if (showHands) {
                    this.hands[index].show()
                }
            } else {
                this.hands[i].hide()
            }
        })
    }
}
