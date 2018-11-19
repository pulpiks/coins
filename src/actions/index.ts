// Actions
import * as TYPES from '../types/types';
import { passersIdsTypes, ENEMY_TYPES } from '../constants/constants';

type CollidePersonWithPolicemanAction = {
    id: string
}

export function collidePersonWithPoliceman(action: CollidePersonWithPolicemanAction) {
    return {
        type: TYPES.PERSON_POLICEMAN_COLLIDE,
        id: action.id
    };
}

export function removePolicemanFromCollided(action: CollidePersonWithPolicemanAction) {
    return {
        type: TYPES.PERSON_POLICEMAN_REMOVE,
        id: action.id
    };
}

export function addCactus() {
    return {
        type: TYPES.ADD_CACTUS
    }
}

type AddEnemyAction = {
    readonly playerId: string,
    readonly type: ENEMY_TYPES
}

export function addEnemy(action: AddEnemyAction) {
    return {
        type: TYPES.ADD_ENEMY,
        enemyType: action.type,
        playerId: action.playerId
    }
}

export function throwCactus() {
    return {
        type: TYPES.THROW_CACTUS
    }
}

export function changeMoney(amount: number) {
    return {
        type: TYPES.UPDATE_MONEY,
        amount
    }        
}

// export function collidePersonWithEnemy(action) {
//     return {
//         type: TYPES.ENEMY_COLLIDE,
//         type: action.type
//     }
// }

interface ReduceModeAction {
    readonly cause: string
}

export function reduceMood(action: ReduceModeAction) {
    return {
        type: TYPES.REDUCE_MOOD,
        cause: action.cause
    }
}

interface ChangeMoodAction {
    readonly incr: number
}

export function changeMood(action: ChangeMoodAction) {
    return {
        type: TYPES.CHANGE_MOOD,
        incr: action.incr
    }
}

export interface GameOverAction {
    readonly msg: string
}

export function gameOver(action: GameOverAction) {
    return {
        type: TYPES.GAME_OVER,
        msg: action.msg
    }
}

export function collideOfficial(id: number) {
   return {
       type: TYPES.COLLIDE_OFFICIAL,
       id
   }     
}

export function collidePasser(id: passersIdsTypes) {
    return {
        type: TYPES.COLLIDE_PASSER,
        id
    }
}