import autobind from 'autobind-decorator';

import { POLICEMAN, ENEMY_TYPES } from '../constants/constants';
import Person from './Person';
import Enemy from './Enemy';

import store from '../store';

export default class Policeman extends Enemy{
    game: Phaser.Game
    sprite: Phaser.Sprite
    dir: number = Math.round(Math.random()) ? 1 : -1
    velocity: number
    animationRun: Phaser.Animation
    timerChangingVelocity: number

    constructor(game: Phaser.Game) {
        super(game, {
            x: game.rnd.between(POLICEMAN.rangeX[0], POLICEMAN.rangeX[1]),
            y: game.world.height - 50,
            type: ENEMY_TYPES.policeman
        });
        
        this.game = game;

        this.sprite.scale.setTo(0.12, 0.12)
        this.sprite.anchor.set(0.5, 1)
        // this.sprite.body.immovable = true
        this.animationRun = this.sprite.animations.add('move', [7, 6, 5, 4, 3, 2, 1, 0], 8, true)
        this.sprite.animations.play('stand')
        this.sprite.body.gravity.y = 300
        this.timerChangingVelocity = Date.now()
        this.sprite.body.collideWorldBounds = true
        this.velocity = this.game.rnd.between(POLICEMAN.speed_min, POLICEMAN.speed_max)

        // store.subscribe(this.collideWithCactus)
    }

    update() {
        if (this.isTouchedByCactus) {
            this.sprite.animations.stop('move', true);
            return true;
        }
        if (Date.now() - this.timerChangingVelocity > POLICEMAN.time_threshold) {
            this.sprite.body.moves = true;
            this.timerChangingVelocity = Date.now();
            this.dir = Math.round(Math.random()) ? 1 : -1;
            this.velocity = this.game.rnd.between(POLICEMAN.speed_min, POLICEMAN.speed_max);
        }

        this.sprite.scale.setTo(-this.dir * Math.abs(this.sprite.scale.x), this.sprite.scale.y);
        this.sprite.body.velocity.x = this.velocity * this.dir;

        if ((this.sprite.body.x <= 0 && this.dir < 0) ||
            (this.sprite.body.x >= this.game.world.width && this.dir > 0)) {
            if (this.sprite.body.x <= 0) {
                this.sprite.body.x = 0;
            }
            else {
                this.sprite.body.x = this.game.world.width;
            }
            this.sprite.body.velocity.x = 0;
            this.dir *= -1;
            this.sprite.animations.stop('move', true);
        }
        else {
            if (
                this.sprite.animations.currentAnim.name !== 'move' ||
                !this.sprite.animations.currentAnim.isPlaying
            ) {
                this.sprite.animations.play('move', (this.velocity < 15) ? 5 : 12);
            }
        }
    }

    // @autobind
    // collideWithCactus() {
    //     const state = store.getState();
    //     if (state.collide_id_with_cactus == this.sprite.playerId) {
    //
    //     }
    // }
    //
    // onCactusCollision() {
    //
    // }

}