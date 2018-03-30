import { CACTUS } from '../constants/constants';

import Person from './Person';

export default class Cactus {
    cactus: Person;

    constructor({
        game,
        x,
        y,
        key
    }: { cactus:Phaser.Sprite, game:Phaser.State }) {
        this.cactus = new Person({
            game,
            x,
            y,
            key
        });
        this.cactus.width = CACTUS.width;
        this.cactus.height = CACTUS.height;
        this.cactus.body.immovable = true;
        this.cactus.allowGravity = false;
        this.cactus.body.collideWorldBounds = true;
        this.cactus.body.onWorldBounds = new Phaser.Signal();
        this.cactus.body.onWorldBounds.add(this.hitWorldBounds, this);
        return this.cactus;
    }

    hitWorldBounds() {
        this.cactus.destroy();
    }
}