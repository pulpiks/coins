// Actions
import * as TYPES from '../types/types';
import { passersIdsTypes } from '../constants/constants';

type CollidePersonWithPolicemanAction = {
    id: string
}

export function collidePersonWithPoliceman(action: CollidePersonWithPolicemanAction) {
    return {
        type: TYPES.PERSON_POLICEMAN_COLLIDE,
        id: action.id
    };
}

export function addCactus() {
    return {
        type: TYPES.ADD_CACTUS
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