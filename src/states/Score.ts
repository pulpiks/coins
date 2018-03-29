import autobind from 'autobind-decorator';
import Coins from './Coins';
import Person from './Person';
import Mood from './Mood';

import store from '../store';

class Score {
    group: Phaser.Group;
    game: Phaser.Game;
    coins: Coins;
    person: Person;
    cactusesText: Phaser.Text;
    mood: Mood;

    constructor({ game, person, coins }: {
        game: Phaser.Game,
        person: Person
    }) {
        this.game = game;
        this.person = person;
        this.group = this.game.add.group();
        this.group.fixedToCamera = true;
        this.group.x = 0;
        this.group.y = 0;
        this.mood = new Mood({ game });
        this.coins = new Coins({ game });
        this.group.add(this.coins.group);


        let cactusGroup = this.game.add.group();
        let cactusImg = this.game.add.sprite(20, 85, 'tilescactus');
        cactusImg.width = 30;
        cactusImg.height = 30;

        this.cactusesText = this.game.add.text(
            55,
            85,
            '0',
            {
                font: '25px Arial',
                fill: '#fff'
            }
        );
        // this.textTimer.anchor.set(1, 0);
        // this.textTimer.setShadow(2, 2, 'rgba(0, 0, 0, .8)', 0);
        cactusGroup.add(cactusImg);
        cactusGroup.add(this.cactusesText);
        this.group.add(cactusGroup);

        store.subscribe(this.updateScore);
    }

    @autobind
    updateScore() {
        const state = store.getState();
        const { cactuses } = state;
        if (this.cactuses !== cactuses) {
            this.cactuses = cactuses;
            this.cactusesText.setText(cactuses.toString());
        }
    }

    kill() {
        this.group.killAll();
    }
}

export default Score;