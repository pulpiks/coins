import { ENEMY } from '../constants/constants';

export default class Enemy {
    enemies: Phaser.Group;
    enemySprite: Phaser.Sprite;
    game: Phaser.State;
    enemy: any;
    person: Phaser.Sprite;

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
        this.enemySprite.name = 'enemy_'+this.enemy.name;
        this.enemySprite.anchor.set(0.5, 1);
        // enemySprite.body.gravity.y = 200;
        this.enemySprite.body.collideWorldBounds = true;
        this.enemySprite.body.immovable = true;
    }

    moveEnemy(personSprite: Phaser.Sprite) {
        if (personSprite.left >= this.enemySprite.left) {
            this.enemySprite.body.velocity.x = ENEMY.speed;
        }
        else {
            let dir = Math.round(Math.random());
            this.enemySprite.body.velocity.x =
                this.game.rnd.integerInRange(ENEMY.speed_min, ENEMY.speed_max) * (dir ? 1 : -1);
            // ??? this.enemiesObj[this.enemySprite.name]['velocityX'] = this.enemySprite.body.velocity.x;
        }
        this.enemySprite.body.gravity.y = 200;
    }

    move(personSprite: Phaser.Sprite) {
        this.moveEnemy(personSprite);
        let timer = this.game.time.create(false);
        timer.loop(2000, this.moveEnemy.bind(this), this);
        timer.start();
    }
}