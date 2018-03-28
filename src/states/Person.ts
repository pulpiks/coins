import { generatorId } from '../utils';

const g = generatorId();

const { get } = g;

export default class Person extends Phaser.Sprite {
    constructor ({
        game,
        x,
        y,
        key
    }) {
        super(game, x, y, key);
        this.person_id = get(key);
        game.add.existing(this);
    }
}
