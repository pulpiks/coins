import Player from './Player';

import { POLICEMAN } from '../constants/constants';

export default class Policeman extends Player {
    game: Phaser.Game;
    options: any;
    sprite: Phaser.Sprite;
    dir: number = Math.round(Math.random()) ? 1 : -1;
    velocity: number;
    animationRun: Phaser.Animation;
    timerChangingVelocity: number;

    constructor(game: Phaser.Game, options = {}) {
        super(game, options);
        this.game = game;
        this.options = options;
        this.sprite = this.game.add.sprite(
            this.game.rnd.between(POLICEMAN.rangeX[0], POLICEMAN.rangeX[1]),
            this.game.world.height-50, 'policeman'
        );
        this.sprite.scale.setTo(0.12, 0.12);
        this.sprite.anchor.set(0.5, 1);
        this.game.physics.arcade.enable(this.sprite);
        this.animationRun = this.sprite.animations.add('move', [7, 6, 5, 4, 3, 2, 1, 0], 8, true);
        this.sprite.animations.play('stand');
        this.timerChangingVelocity = Date.now();
        this.sprite.body.collideWorldBounds=true;
        this.velocity = this.game.rnd.between(POLICEMAN.speed_min, POLICEMAN.speed_max);
        // this.addListener('move', this.move.bind(this));
    }

    update() {
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
                this.sprite.animations.play('move', (this.velocity < 30) ? 8 : 12);
            }
        }
    }

}