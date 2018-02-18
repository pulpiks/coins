import { COINS } from '../constants/constants';

export default class Coins {
    coinImage: Phaser.Sprite;
    label: Phaser.Text;
    money: number;
    game: Phaser.Game;
    group: Phaser.Group;
    // width: number;

    constructor( { game }: { game: Phaser.Game } ) {
        this.game = game;
        this.money = COINS.startSum;

        this.group = this.game.add.group();
        // this.group.x = x;
        // this.group.y = y;
        // this.width = width;

        this.coinImage = this.game.add.sprite(200, 100, 'coin');
        this.coinImage.width = 20;
        this.coinImage.height = 30;

        this.label = this.game.add
            .text(240, 100, String(this.money), {
                font: "30px Arial",
                fill: "#ffffff",
                align: "center"
            });

        this.group.add(this.coinImage);
        this.group.add(this.label);
    }

    update() {
        this.label.setText(this.money.toString());
    }

    takeMoney(amount:number) {
        this.money -= amount;
    }

    addMoney(amount:number) {
        this.money += amount;
    }

    get amount() {
        return this.money;
    }
}