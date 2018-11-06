import autobind from 'autobind-decorator';

import MoodRange from './RangeComponent';

import store from '../store';
import { gameOver } from '../actions';
import { FAIL_MSG } from '../constants/constants';

interface Colors {
    readonly [percentage: string]: string
}
const colors: Colors = {
    '10': '#FF0000',
    '20': '#FF4000',
    '30': '#DF7401',
    '40': '#DBA901',
    '50': '#D7DF01',
    '60': '#A5DF00',
    '70': '#74DF00',
    '80': '#3ADF00',
    '90': '#01DF01',
    '100': '#01DF3A',
}

const LIMIT_MOOD: number = 30 

export default class Mood {
    group: Phaser.Group
    game: Phaser.Game
    cactusesText: Phaser.Text
    mood: any
    moodValue: number = 100
    total: number
    timer: any
    barSpriteTween: Phaser.Tween
    
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

        /*
        { alpha: 0 },
            300, Phaser.Easing.Linear.None, true, 0, 100, false
        */
        store.subscribe(this.changeMood);

        this.barSpriteTween = this.game.add.tween(this.mood.barSprite).to( 
            { alpha: 0.5 }, 
            300, 
            Phaser.Easing.Linear.None, 
            false,
            0,
            -1,
            false
        );
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
        const total: number = store.getState().mood.total
        if (this.total !== total) {
            this.total = total
            this.mood.setPercent(this.total)

            if (this.total === 0) {
                store.dispatch(gameOver({
                    msg: FAIL_MSG.mood
                })) 
            }

            const percentages = Object.keys(colors).filter((p) => !Number.isNaN(+p)).map(p => +p)

            const reversedPercentages = percentages.reverse()
            const foundPercentage = reversedPercentages.find((p) => p <= this.total)
            if (foundPercentage) {
                this.mood.setBarColor(colors[`${foundPercentage}`])
                if (foundPercentage <= LIMIT_MOOD) {
                    this.barSpriteTween.start()
                }
                else {
                    this.barSpriteTween.stop()
                }
            }
        }
    }
}
