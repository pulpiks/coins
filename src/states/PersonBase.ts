import autobind from 'autobind-decorator'

import { ENEMY_TYPES, ground } from '../constants/constants'
import Person from './Person'
import Enemy from './Enemy'

import store from '../store'

type SPEED = {
    readonly min: number,
    readonly max: number,
}

interface PersonBaseProps {
    readonly game: Phaser.Game
    readonly x: number
    readonly y?: number
    readonly key: string
    readonly speed: SPEED
    readonly time_threshold: number
    readonly velocity: {
        readonly min: number,
        readonly max: number,
    }
}

export default class PersonBase extends Person{
    game: Phaser.Game
    sprite: Phaser.Sprite
    dir: number = Math.round(Math.random()) ? 1 : -1
    velocity: number
    animationRun: Phaser.Animation
    timerChangingVelocity: number
    props: PersonBaseProps

    constructor(props: PersonBaseProps) {
        super({
            game: props.game,
            x: props.x,
            y: props.game.world.height - ground.height,
            key: props.key,
        })
        this.game = props.game
        this.props = {...props}
        this.sprite.body.collideWorldBounds = true
        this.velocity = this.game.rnd.between(props.speed.min, props.speed.max)
        this.sprite.body.gravity.y = 300
        this.timerChangingVelocity = Date.now()
    }

    public update() {
        if (Date.now() - this.timerChangingVelocity > this.props.time_threshold) {
            this.sprite.body.moves = true
            this.timerChangingVelocity = Date.now()
            this.dir = Math.round(Math.random()) ? 1 : -1
            this.velocity = this.game.rnd.between(this.props.speed.min, this.props.speed.max)
        }

        this.sprite.scale.setTo(-this.dir * Math.abs(this.sprite.scale.x), this.sprite.scale.y)
        this.sprite.body.velocity.x = this.velocity * this.dir

        if ((this.sprite.body.x <= 0 && this.dir < 0) ||
            (this.sprite.body.x >= this.game.world.width && this.dir > 0)) {
            if (this.sprite.body.x <= 0) {
                this.sprite.body.x = 0
            }
            else {
                this.sprite.body.x = this.game.world.width
            }
            this.sprite.body.velocity.x = 0
            this.dir *= -1
            this.sprite.animations.stop('move', true)
        }
        else {
            if (
                this.sprite.animations.currentAnim.name !== 'move' ||
                !this.sprite.animations.currentAnim.isPlaying
            ) {
                this.sprite.animations.play('move', (this.velocity < 15) ? this.props.velocity.min : this.props.velocity.max)
            }
        }
    }

    public collideWithObstacles() {
        this.sprite.body.velocity.x = 0
    }
}