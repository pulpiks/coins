class Mood {
    group: Phaser.Group;
    game: Phaser.Game;
    coins: Coins;
    person: Person;
    cactusesText: Phaser.Text;

    constructor({ game, person, coins }: {
        game: Phaser.Game,
        person: Person,
        coins: Coins
    }) {
        this.game = game;
        this.coins = coins;
        this.person = person;
        this.group = this.game.add.group();
        this.group.fixedToCamera = true;
        this.group.x = this.game.width - 60;
        this.group.y = 20;

        this.group.add(this.coins.group);

        this.cactusesText = this.game.add.text(
            0,
            10,
            this.person.cactuses.length.toString(),
            {
                font: '25px Arial',
                fill: '#fff'
            }
        );
        // this.textTimer.anchor.set(1, 0);
        // this.textTimer.setShadow(2, 2, 'rgba(0, 0, 0, .8)', 0);
        this.group.add(this.cactusesText);
    }

    update() {
        this.coins.update();
        this.updateCounterCactus();
    }

    updateCounterCactus() {
        this.cactusesText.setText(this.person.cactuses.length.toString());
    }

    kill() {
        this.group.killAll();
    }
}

export default Score;