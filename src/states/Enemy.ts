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

    constructor({ game, enemy, person, enemies }) {
        this.game = game;
        this.enemy = enemy;
        this.person = person;
        this.enemies = enemies
        this.enemySprite = this.enemies.create(
            this.enemy.x,
            this.enemy.y,
            'enemy'
        );
        this.enemySprite.width = ENEMY.width;
        this.enemySprite.height = ENEMY.height;
        this.enemySprite.body.gravity.y = 200;
        console.log(this.enemy.name);
        this.enemySprite.name = 'enemy_'+ generatorId.getId();
        this.enemySprite.anchor.set(0.5, 1);
        // enemySprite.body.gravity.y = 200;
        this.enemySprite.body.collideWorldBounds = true;
        this.enemySprite.body.immovable = true;
        this.timerChangingVelocity = Date.now();
    }

    move(personSprite: Phaser.Sprite) {
        console.log('----', this.enemySprite.body);
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
}