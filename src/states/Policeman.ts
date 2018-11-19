import autobind from 'autobind-decorator';

import { ENEMY_TYPES, TIMEOUT_COLLIDE_POLIMEN_CACTUS, passersConstants, LayersIds } from '../constants/constants';
import Enemy from './Enemy';

import store from '../store';
import { collidePersonWithPoliceman } from '../actions';
import { generatorId } from '../utils';

export const POLICEMAN = {
    width: 100,
    height: 70,
    rangeX: [100, 1500],
    count: 5,
    speed_min: 1,
    speed_max: 40,
    time_threshold: 3000,
    time_disabled: 3000,
}

export const POLICEMAN_SPRITE_INFO = {
    setTo: [0.12, 0.12],
    stand: {
        frames: [0],
        frameRate: 1,
    }, 
    move: {
        frames: [7, 6, 5, 4, 3, 2, 1, 0],
        frameRate: 8
    }
}

export class Policeman extends Enemy{
    game: Phaser.Game
    sprite: Phaser.Sprite
    dir: number = Math.round(Math.random()) ? 1 : -1
    velocity: number
    animationRun: Phaser.Animation
    timerChangingVelocity: number

    constructor(game: Phaser.Game) {
        super({
            game, 
            coord: {
                x: game.rnd.between(POLICEMAN.rangeX[0], POLICEMAN.rangeX[1])
            }, 
            speed: {
                min: POLICEMAN.speed_min,
                max: POLICEMAN.speed_max,
            }, 
            key: LayersIds.policeman,
            spriteOptions: POLICEMAN_SPRITE_INFO,
            type: ENEMY_TYPES.policeman,
            time_threshold: POLICEMAN.time_threshold,
            time_disabled: POLICEMAN.time_disabled,
        })
        
        this.game = game;
    }
}

interface CollideEnemiesIdProps {
    [k: string]: number
}

interface EnemyObjProp {
    [key: string]: Enemy
}
export interface PolicemanManagerProps {
    // readonly policemen: typeof Policeman[]
    // readonly create: () => void,
    readonly getAllSprites: () => void,
    readonly getAllActivePoliceman: () => void,
    readonly update: () => void,
    readonly getPolicemanPlayerId: (sprite: Phaser.Sprite) => void
    readonly collidePerson: (policemanSprite: Phaser.Sprite) => void
    readonly collideEnemiesId: CollideEnemiesIdProps
    // readonly enemiesObj: EnemyObjProp
    readonly collideCactus: (enemy: Phaser.Sprite) => void
}

export const PolicemanManager = (game: Phaser.Game): PolicemanManagerProps => {
    const enemies = game.add.physicsGroup(Phaser.Physics.ARCADE);
    const enemiesObj: EnemyObjProp = {}
    for(let i = 0; i < POLICEMAN.count; i++) {
        let policeman = new Policeman(
            game
        )
        // this.policemen.push(policeman)
        // this.enemies.add(policeman.sprite)
        enemiesObj[policeman.playerId] = policeman
    }
    return {
        collideEnemiesId: {},
        getAllSprites: function() {
            return Object.values(enemiesObj).map((enemy: Policeman) => enemy.sprite)
        },
        getAllActivePoliceman: function() {
            return Object
                .values(enemiesObj)
                .filter(enemy => !enemy.isTouchedByCactus)
                .map((enemy: Policeman) => enemy.sprite)
        },
        update: function() {
            Object.values(enemiesObj).forEach((policeman: Policeman) => {
                policeman.update()
            })
            // for (let name in enemiesObj) {
            //     if (enemiesObj[name].enemy === null) {
            //         enemiesObj[name] = null;
            //         delete enemiesObj[name];
            //     }
            // }
        },
        getPolicemanPlayerId: function(sprite) {
            return Object
                .keys(enemiesObj)
                .find((playedId: string) => 
                    enemiesObj[playedId].sprite === sprite
                )
        },

        collidePerson: function(policeman) {
            debugger
            const policemanId = this.getPolicemanPlayerId(policeman)
            let cachedTime = this.collideEnemiesId[policemanId]
            if ((
                !cachedTime 
                || Date.now() - cachedTime > TIMEOUT_COLLIDE_POLIMEN_CACTUS
                ) && !enemiesObj[policemanId].isTouchedByCactus){
                this.collideEnemiesId[policemanId] = Date.now();
                store.dispatch(collidePersonWithPoliceman({
                    id: policemanId
                }));
            }
        },
        collideCactus: function(enemy: Phaser.Sprite) {
            const playerId = this.getPolicemanPlayerId(enemy)
            enemiesObj[playerId].onCactusCollision()
        }
    }
}