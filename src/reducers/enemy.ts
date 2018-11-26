import { ADD_ENEMY } from '../types/types';
import { ENEMY_TYPES } from '../constants/constants';

export interface EnemyState {
    enemies: {
        [k in string]: string[]
    }
}

const defaultState = {
    enemies: {

    }
};

type AddActionType = {
    type: typeof ADD_ENEMY,
    enemyType: ENEMY_TYPES,
    playerId: string
}

type Action = AddActionType

// XXX maybe this file need to be removed

export default function (state: EnemyState = defaultState, action: Action) {
    switch(action.type) {
        case ADD_ENEMY:
            const enemies = {...state.enemies}
            if (typeof(enemies[action.enemyType]) === 'undefined') {
                enemies[action.enemyType] = []
            }
            enemies[action.enemyType].push(action.playerId)
            return {
                ...state,
                enemies
            };
        default:
            return state;
    }
}