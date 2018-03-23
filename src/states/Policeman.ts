import Player from './Player';

import { POLICEMAN } from '../constants/constants';

export default class Policeman extends Player {
    game: Phaser.Game;
    options: any;
    sprite: Phaser.Sprite;

    constructor(game: Phaser.Game, options = {}) {
        super(game, options);
        this.game = game;
        this.options = options;
        this.sprite = this.game.add.sprite(100, this.game.world.height-50, 'policeman');
        this.sprite.scale.setTo(0.12, 0.12);
        this.sprite.anchor.set(0.5, 1);

        this.animationsRight = this.sprite.animations.add('right', [0, 1, 2, 3,4,5,6,7], 20, true);
        this.animationsJump = this.sprite.animations.add('jump', [4], 20, true);
        this.animationsStand = this.sprite.animations.add('stand', [0], 20, true);
        // this.addListener('move', this.move.bind(this));
    }

    move() {
        console.log('move policeman');
    }

    collide() {

    }

}