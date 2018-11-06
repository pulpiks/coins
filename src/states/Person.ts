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
    public sprite: Phaser.Sprite
    public playerId: string

    constructor ({
        game,
        x,
        y,
        key
    }: PersonProps) {
        this.sprite = game.add.sprite(x, y, key)
        this.playerId = get(key)
        game.add.existing(this.sprite)
        game.physics.arcade.enable(this.sprite)
    }
}
