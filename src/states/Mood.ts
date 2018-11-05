import autobind from 'autobind-decorator';

import MoodRange from './RangeComponent';

import store from '../store';

export default class Mood {
    group: Phaser.Group
    game: Phaser.Game
    cactusesText: Phaser.Text
    mood: any
    moodValue: number = 100
    total: number

    constructor({ game }: {
        game: Phaser.Game
    }) {
        this.game = game;
        this.mood = new MoodRange(this.game, {
            width: 200,
            height: 30,
            x: 120,
            y: 30,
            bg: {
                color: '#651828'
            },
            bar: {
                color: '#10ff80'
            },
            animationDuration: 200,
            flipped: false,
            isFixedToCamera: true
        });

        store.subscribe(this.changeMood);
        // this.coins = coins;
        // this.person = person;
        // this.group = this.game.add.group();
        // this.group.fixedToCamera = true;
        // this.group.x = this.game.width - 60;
        // this.group.y = 20;
        //
        // this.group.add(this.coins.group);
        //
        // this.cactusesText = this.game.add.text(
        //     0,
        //     10,
        //     this.person.cactuses.length.toString(),
        //     {
        //         font: '25px Arial',
        //         fill: '#fff'
        //     }
        // );
        // this.group.add(this.cactusesText);
    }

    @autobind
    changeMood() {
        const total: number = store.getState().mood.total;
        if (this.total !== total) {
            this.total = total;
            this.mood.setPercent(this.total);
        }
    }
}
