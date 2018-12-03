import autobind from 'autobind-decorator';

import { COINS, FAIL_MSG, STATES } from '../constants/constants';

import store from '../store';
import { gameOver } from '../actions';

export default class Coins {
    coinImage: Phaser.Sprite;
    label: Phaser.Text;
    money: number = 0;
    game: Phaser.Game;
    group: Phaser.Group;
    // width: number;

    constructor( { game }: { game: Phaser.Game } ) {
        this.game = game;

        this.group = this.game.add.group();
        this.group.x = 20;
        this.group.y = 50;

        this.coinImage = this.game.add.sprite(0, 0, 'coin');
        this.coinImage.width = 30;
        this.coinImage.height = 30;

        this.label = this.game.add
            .text(
                35,
                0,
                String(COINS.startSum),
                {
                    font: "25px Arial",
                    fill: "#ffffff",
                    align: "center"
                }
            );

        this.group.add(this.coinImage);
        this.group.add(this.label);
        store.subscribe(this.update);
    }

    @autobind
    update() {
        const state = store.getState();
        const { money } = state.score;
        if (money !== this.money) {
            this.money = money;
            this.label.setText(this.money.toString());
            if (money === 0) {
                store.dispatch(gameOver({
                    msg: FAIL_MSG.money
                }))
                this.game.state.start(STATES.Finish)
            }
        }
    }
}