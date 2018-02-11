import { PERSON } from '../constants/constants';
import Coins from './Coins';
import Score from './Score';

export default class Person {
    isTouchedEnemy: boolean;
    game: Phaser.State;
    sprite: Phaser.Sprite;
    coins: Coins;
    tween: Phaser.Tween;
    time: number;
    cactusesCount: number;
    private timer: any;

    constructor( { game, coins }) {
        this.isTouchedEnemy = false;
        this.game = game;
        this.coins = coins;
        this.time = Date.now();
        this.cactusesCount = 0;

        this.sprite = this.game.add.sprite(0, this.game.world.height, 'person');
        this.sprite.width = PERSON.width;
        this.sprite.height = PERSON.height;
        this.sprite.anchor.set(0.5, 1);
        this.game.physics.arcade.enable(this.sprite);
        this.sprite.body.gravity.y = 2000;

        // this.sprite.body.linearDamping = 1;
        // this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);
        // this.sprite.animations.play('right');
        //
        this.sprite.body.collideWorldBounds = true;

        this.game.camera.follow(this.sprite);
    }

    collideWithEnemy(enemy:Phaser.Sprite, person: Phaser.Sprite) {
        if (!this.isTouchedEnemy) {
            this.isTouchedEnemy = true;
            this.coins.takeMoney(10);
            this.tween = this.game.add.tween(this.sprite).to(
                { alpha: 0 },
                300, Phaser.Easing.Linear.None, true, 0, 100, false
            );
            // this.timer = this.game.time.create(false);
            // this.timer.loop(2000, this.finishCollision, this);
            // this.timer.start();
            this.timer = this.game.time.events.loop(2000, this.finishCollision, this);
        }
        this.sprite.body.velocity.x = -1 * Math.abs(this.sprite.body.velocity.x);

    }

    move(cursors: Phaser.CursorKeys) {
        if (!this.isTouchedEnemy) {
            this.sprite.body.velocity.x = 0;
            if (cursors.left.isDown) {
                this.sprite.body.velocity.x = -200;
            }
            else if (cursors.right.isDown) {
                this.sprite.body.velocity.x = 200;
            }
            if (cursors.up.justDown) {
                if (this.sprite.body.onFloor()) {
                    this.sprite.body.velocity.y = -700;
                }
            }
        }
    }

    finishCollision() {
        // this.timer.remove();
        this.game.time.events.remove(this.timer);
        this.isTouchedEnemy = false;
        this.sprite.alpha = 1;
        this.tween.stop();
    }

    collideWithCactus(persionSprite: Phaser.Sprite, cactus: Phaser.Sprite) {
        console.log(persionSprite, cactus);

    }

    addCactus() {
        this.cactusesCount++;
    }
}