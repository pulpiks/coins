import MoodRange from './RangeComponent';
import { MOOD } from '../constants/constants';

export default class Mood {
    group: Phaser.Group;
    game: Phaser.Game;
    coins: Coins;
    person: Person;
    cactusesText: Phaser.Text;
    mood: MoodRange;
    moodValue: number = 100;

    constructor({ game }: {
        game: Phaser.Game
    }) {
        this.game = game;
        this.mood = new MoodRange(this.game, {
            width: 250,
            height: 40,
            x: 0,
            y: 0,
            bg: {
                color: '#651828'
            },
            bar: {
                color: '#FEFF03'
            },
            animationDuration: 200,
            flipped: false
        });


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

    reduceMood() {
        this.moodValue = this.moodValue - MOOD.step;
        if(this.moodValue < 0) this.moodValue = 0;
        this.mood.setPercent(this.moodValue);
    }

    cheerUp() {
        this.moodValue = this.heamoodValuelthValue + MOOD.step;
        if(this.moodValue > 100) this.healmoodValuethValue = 100;
        this.mood.setPercent(this.moodValue);
    }
}

export default Mood;