// Actions
import * as TYPES from '../types/types';

export function collidePersonWithEnemy(action) {
    return {
        type: TYPES.PERSON_POLICEMAN_COLLIDE,
        id: action.policeman_id
    };
}

export function removePersonWithEnemy(action) {
    return {
        type: TYPES.PERSON_POLICEMAN_REMOVE,
        id: action.policeman_id
    }
}