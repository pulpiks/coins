import {
    ENEMY_TYPES,
    PasserConstantOptions,
    DEACTIVATE_TIME_FOR_COLLIDE_PERSON_POLICEMAN
} from '../constants/constants';

import Person from './Person';

import { generatorRandomString } from '../utils';
import { Passer, COORD, SPEED } from './Passer';
import store from '../store';
import { addEnemy } from '../actions';

const generatorId = generatorRandomString();

interface EnemyProps {
    readonly game: Phaser.Game,
    readonly coord: COORD,
    readonly speed: SPEED,
    readonly key: string,
    readonly type: ENEMY_TYPES,
    readonly spriteOptions: PasserConstantOptions
    readonly time_threshold?: number
    readonly time_disabled: number
}

// function EnemiesGlobal(game: Phaser.Game) {
//     return function decorator(Class: any) {
//         return (...args: any[]) => {
//             console.log(`Arguments for ${name}: args`); 
//             const enemiesGroup = game.add.physicsGroup(Phaser.Physics.ARCADE)
//             return new Class(...args, enemiesGroup)
//         }
//     }
// }


export default class Enemy extends Passer{
    sprite: Phaser.Sprite
    game: Phaser.Game
    time_disabled: number
    public isTouchedByCactus: boolean = false
    tween: Phaser.Tween
    timer: Phaser.TimerEvent
    type: ENEMY_TYPES
    isCollidedWithPerson: boolean = false

    constructor(props: EnemyProps) {
        super(
            props.game, 
            props.coord,
            props.speed,
            props.key,
            props.spriteOptions,
            props.time_threshold
        )

        this.game = props.game
        this.type = props.type    
        this.time_disabled = props.time_disabled
        this.addEnemy()
    }

    addEnemy() {
        store.dispatch(addEnemy({
            playerId: this.playerId,
            type: this.type,
        }))
    }

    update() {
        if (this.isTouchedByCactus) {
            this.sprite.animations.stop('move', true);
            return true;
        }
        super.update()
    }

    collideWithObstacles(enemy: Phaser.Sprite, obstacles: Phaser.Sprite) {
        // this.enemiesObj[enemy.name].body.velocity.y = -400;
    }

    onCactusCollision() {
        switch(this.type) {
            case ENEMY_TYPES.policeman:
                this.deactivateForTheTime()
                break
            default: break
        }
    }

    deactivateForTheTime() {
        this.isTouchedByCactus = true
        this.sprite.body.moves = false
        this.tween = this.game.add.tween(this.sprite).to(
            { alpha: 0 },
            300, Phaser.Easing.Linear.None, true, 0, 100, false
        )
        // this.timer = this.game.time.create(false)
        // this.timer.loop(2000, this.finishCollision, this)
        // this.timer.start()
        this.timer = this.game.time.events.loop(this.time_disabled, this.finishCollision, this)
    }

    finishCollision() {
        // this.timer.remove();
        this.game.time.events.remove(this.timer)
        this.isTouchedByCactus = false
        this.sprite.alpha = 1
        this.tween.stop()
    }

    kill() {
        this.sprite.kill()
    }

    public collideWithPerson(cbBefore?: () => void, cbAfter?: () => void) {
        if (!this.isTouchedByCactus && !this.isCollidedWithPerson) {
            this.isCollidedWithPerson = true

            if (cbBefore) {
                cbBefore()
            }

            const timer = this.game.time.events.loop(DEACTIVATE_TIME_FOR_COLLIDE_PERSON_POLICEMAN, () => {
                this.isCollidedWithPerson = false
                this.game.time.events.remove(timer);
                if (cbAfter) {
                    cbAfter()
                }
            }, this)
        }
    }
}