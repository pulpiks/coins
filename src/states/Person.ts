import { generatorId } from '../utils';

const g = generatorId();
const { get } = g;

interface PersonProps {
    readonly game: Phaser.Game,
    readonly x: number,
    readonly y: number,
    readonly key: string,
}
 
export default class Person {
    readonly sprite: Phaser.Sprite
    readonly playerId: string

    constructor ({
        game,
        x,
        y,
        key
    }: PersonProps) {
        this.sprite =  new Phaser.Sprite(game, x, y, key)
        this.playerId = get(key);
        game.add.existing(this);
        game.physics.arcade.enable(this);
    }
}
