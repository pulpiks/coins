import { COINS } from '../constants/constants';

export default class Coins {
    coinImage: Phaser.Sprite;
    coinSumText: Phaser.Text;
    money: number;
    game: Phaser.State;
    constructor( { game } ) {
        this.game = game;
        this.money = COINS.startSum;
        this.coinImage = this.game.add.sprite(200, 100, 'coin');
        this.coinImage.width = 20;
        this.coinImage.height = 30;
        this.coinSumText = this.game.add
            .text(240, 100, String(this.money), {
                font: "30px Arial",
                fill: "#ffffff",
                align: "center"
            });
    }

    renderMoney() {
        this.coinSumText.setText(this.money.toString());
    }

    takeMoney(amount:number) {
        console.log('%%%%%%');
        this.money -= amount;
    }

    addMoney(amount:number) {
        this.money += amount;
    }

    get coin() {
        return this.money;
    }
}