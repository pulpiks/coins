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
const PENALTY_AMOUNT = 10

interface HandsProps {
    readonly game: Phaser.Game,
    readonly x: number,
    readonly y: number,
}

export class Hands extends Person {
    readonly game: Phaser.Game
    tween: Phaser.Tween
    tween2: Phaser.Tween
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

        this.tween = this.game.add.tween(this.sprite).to(
            this.getTweenProps(true),
            0, 
            Phaser.Easing.Linear.None, 
            true, 
            0, 
            -1, 
            true
        )
        
        this.tween2 = this.game.add.tween(this.sprite).to(
            this.getTweenProps(false),
            0, 
            Phaser.Easing.Linear.None, 
            true, 
            0, 
            -1, 
            true
        ) 
    
    }

    getTweenProps(isVisible: boolean) {
        return (isVisible) ? { 
            alpha: 1,
            y: this.sprite.y + 10,
        } : { 
            alpha: 0,
            y: this.sprite.y - 10,
        }
    }

    changeVisibility(isVisible: boolean) {
        if (isVisible) {
            this.tween.resume()
            this.tween2.pause()
        } else {
            this.tween.pause()
            this.tween2.resume()
        }
    }

    update() {
        store.dispatch(changeMoney(-PENALTY_AMOUNT))
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
        // this.update = throttle(this.update, 5000)
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
        const handIndexes = HANDS_COORDS.reduce((res, coord, i) => {
            if (Math.abs(this.hands[i].sprite.centerX - x) < MIN_DISTANCE_TO_APROACH) 
                res.push(i)
            return res    
        }, []) 

        this.hands.forEach((_, i) => {
            const index = handIndexes.find(handIndex => handIndex === i)
            console.log(index)
            typeof(index)!=='undefined' && index >= 0 ? this.hands[i].changeVisibility(true): this.hands[i].changeVisibility(false)
        })
    }
}
