import {
    ENEMY,
    ENEMY_TYPES
} from '../constants/constants';

import Person from './Person';

import { generatorRandomString } from '../utils';

const generatorId = generatorRandomString();

export default class Enemy extends Person{
    sprite: Phaser.Sprite;
    enemySprite: Phaser.Sprite;
    game: Phaser.Game;
    enemy: any;
    person: Person;
    private timerChangingVelocity: number;
    private isTouchedByCactus: boolean = false;
    private tween: Phaser.Tween;
    private timer: Phaser.TimerEvent;

    constructor( game: Phaser.Game, enemy) {
        super({
            game: game,
            x: enemy.x,
            y: enemy.y,
            key: enemy.type
        })
    }

    move(personSprite: Phaser.Sprite) {
        // if (this.isTouchedByCactus) {
        //     return true;
        // }
        // this.enemySprite.body.moves = true;
        // if (personSprite.left >= this.enemySprite.left) {
        //     this.enemySprite.body.velocity.x = this.game.rnd.integerInRange(ENEMY.speed_min, ENEMY.speed_max);
        // }
        // else {
        //     if (Date.now() - this.timerChangingVelocity > ENEMY.time_threshold) {
        //         this.timerChangingVelocity = Date.now();
        //         let dir = Math.round(Math.random());
        //         this.enemySprite.body.velocity.x =
        //             this.game.rnd.integerInRange(ENEMY.speed_min, ENEMY.speed_max) * (dir ? 1 : -1);
        //         // ??? this.enemiesObj[this.enemySprite.name]['velocityX'] = this.enemySprite.body.velocity.x;
        //     }
        // }
    }

    collideWithObstacles(enemy: Phaser.Sprite, obstacles: Phaser.Sprite) {
        // this.enemiesObj[enemy.name].body.velocity.y = -400;
    }

    onCactusCollision() {

        switch(this.enemy.type) {
            case ENEMY_TYPES.fsb:
                this.deactivateForTheTime();
                break;
            case ENEMY_TYPES.gangster:
            case ENEMY_TYPES.official:
                this.kill();
                break;
            case ENEMY_TYPES.prosecutor:
                break;
            case ENEMY_TYPES.policeman:
                this.deactivateForTheTime();
                break;
            default: break;
        }
    }

    deactivateForTheTime() {
        this.isTouchedByCactus = true;
        this.sprite.body.moves = false;
        this.tween = this.game.add.tween(this.sprite).to(
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
        this.game.time.events.remove(this.timer);
        this.isTouchedByCactus = false;
        this.sprite.alpha = 1;
        this.tween.stop();
    }

    kill() {
        this.enemySprite.kill();
        this.enemy = null;
    }
}