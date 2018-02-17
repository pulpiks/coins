import { ENEMY } from '../constants/constants';
import { generatorRandomString } from '../utils';

const generatorId = generatorRandomString();

export default class Enemy {
    enemies: Phaser.Group;
    enemySprite: Phaser.Sprite;
    game: Phaser.State;
    enemy: any;
    person: Phaser.Sprite;
    timerChangingVelocity: Phaser.number;
    isDisabled: boolean;

    constructor({ game, enemy, person, enemies }) {
        this.game = game;
        this.enemy = enemy;
        this.person = person;
        this.enemies = enemies;
        this.enemy.type = this.enemy.properties && this.enemy.properties.enemy_type;
        this.enemySprite = this.enemies.create(
            this.enemy.x,
            this.enemy.y,
            'enemy'
        );
        this.enemySprite.width = ENEMY.width;
        this.enemySprite.height = ENEMY.height;
        this.enemySprite.body.gravity.y = 200;
        this.enemySprite.name = 'enemy_'+ generatorId.getId();
        this.enemySprite.anchor.set(0.5, 1);
        // enemySprite.body.gravity.y = 200;
        this.enemySprite.body.collideWorldBounds = true;
        this.enemySprite.body.immovable = true;
        this.timerChangingVelocity = Date.now();
    }

    move(personSprite: Phaser.Sprite) {
        if (this.isDisabled) {
            return true;
        }
        this.enemySprite.body.moves = true;
        if (personSprite.left >= this.enemySprite.left) {
            this.enemySprite.body.velocity.x = this.game.rnd.integerInRange(ENEMY.speed_min, ENEMY.speed_max);
        }
        else {
            if (Date.now() - this.timerChangingVelocity > ENEMY.time_threshold) {
                this.timerChangingVelocity = Date.now();
                let dir = Math.round(Math.random());
                this.enemySprite.body.velocity.x =
                    this.game.rnd.integerInRange(ENEMY.speed_min, ENEMY.speed_max) * (dir ? 1 : -1);
                // ??? this.enemiesObj[this.enemySprite.name]['velocityX'] = this.enemySprite.body.velocity.x;
            }
        }
    }

    collideWithObstacles(enemy: Phaser.Sprite, obstacles: Phaser.Sprite) {
            // this.enemiesObj[enemy.name].body.velocity.y = -400;
    }

    onCactusCollision() {
        debugger;
        switch(this.enemy.type) {
            case 'fsb':
                console.time('1111');
                this.deactivateForTheTime();
                break;
            case 'official':
                this.kill();
                break;
            case 'prosecutor':
                break;
            default: break;
        }
    }

    deactivateForTheTime() {
        this.isDisabled = true;
        this.enemySprite.body.moves = false;
        this.tween = this.game.add.tween(this.enemySprite).to(
            { alpha: 0 },
            300, Phaser.Easing.Linear.None, true, 0, 100, false
        );
        // this.timer = this.game.time.create(false);
        // this.timer.loop(2000, this.finishCollision, this);
        // this.timer.start();
        this.timer = this.game.time.events.loop(ENEMY.time_disabled, this.finishCollision, this);
    }

    finishCollision() {
        // this.timer.remove();
        console.timeEnd('1111');
        this.game.time.events.remove(this.timer);
        this.isDisabled = false;
        this.enemySprite.alpha = 1;
        this.tween.stop();

    }

    kill() {
        this.enemySprite.kill();
    }
}