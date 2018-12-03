import autobind from 'autobind-decorator';

import { ENEMY_TYPES, passersConstants, LayersIds } from '../constants/constants';
import Enemy from './Enemy';

import store from '../store';
import { collidePersonWithPoliceman, removePolicemanFromCollided } from '../actions';
import { generatorId } from '../utils';

export const POLICEMAN = {
    width: 100,
    height: 70,
    rangeX: [2000, 5000],
    count: 10,
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
    readonly getAllSprites: () => Phaser.Sprite[],
    readonly getAllActivePoliceman: () => Phaser.Sprite[],
    readonly update: () => void,
    readonly getPolicemanPlayerId: (sprite: Phaser.Sprite) => string
    readonly collidePerson: (policemanSprite: Phaser.Sprite) => void
    // readonly enemiesObj: EnemyObjProp
    readonly collideCactus: (enemy: Phaser.Sprite) => void
    readonly collideWithObstacles: (sprite: Phaser.Sprite) => void
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
            // const collidedPolicemanIds = store.getState().policeman.activeIds
            const policemanId = this.getPolicemanPlayerId(policeman)
            // let startTime = collidedPolicemanIds[policemanId].time
            // if ((!startTime || Date.now() - startTime > TIMEOUT_COLLIDE_POLIMEN_CACTUS) && 
            // enemiesObj[policemanId].isTouchedByCactus) {
            //     
            //     enemiesObj[policemanId]
            // }
            // const policemanStore = store.getState().policeman
            // if (policemanStore.activeIds[policemanId]) {
            //     return ;
            // }


            const collideBefore = () => {
                store.dispatch(collidePersonWithPoliceman({
                    id: policemanId,
                }))
            }

            const collideAfter = () => {
                store.dispatch(removePolicemanFromCollided({
                    id: policemanId,
                }))
            }

            enemiesObj[policemanId].collideWithPerson()

        },
        collideCactus: function(policemanSprite) {
            const playerId = this.getPolicemanPlayerId(policemanSprite)
            enemiesObj[playerId].onCactusCollision()
        },
        collideWithObstacles: function(sprite) {
            const playedId = this.getPolicemanPlayerId(sprite)
            enemiesObj[playedId].collideWithObstacles()
        }
    }
}