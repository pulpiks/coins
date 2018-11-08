import {CACTUS} from '../constants/constants'

interface CactusProps {
    readonly game: Phaser.Game
    readonly x: number
    readonly y: number
    readonly key?: string
}

export default class Cactus {
    cactus: Phaser.Sprite

    constructor({game, x, y, key = 'cactus'}: CactusProps) {
        this.cactus = game.add.sprite(
            x,
            y,
            key
        );
        game.physics.arcade.enable(this.cactus);
        this.cactus.width = CACTUS.width;
        this.cactus.height = CACTUS.height;
        this.cactus.body.immovable = true;
        this.cactus.body.allowGravity = false;
        this.cactus.body.collideWorldBounds = true;
        this.cactus.body.onWorldBounds = new Phaser.Signal();
        this.cactus.body.onWorldBounds.add(this.hitWorldBounds, this);
    }

    hitWorldBounds() {
        this.cactus.destroy();
    }
}