// Actions
import * as TYPES from '../types/types';

export function collidePersonWithPoliceman(action) {
    return {
        type: TYPES.PERSON_POLICEMAN_COLLIDE,
        id: action.policeman_id
    };
}


// export function collidePersonWithEnemy(action) {
//     return {
//         type: TYPES.ENEMY_COLLIDE,
//         type: action.type
//     }
// }

// export function reduceMood(action) {
//     return {
//         type: TYPES.REDUCE_MOOD,
//         cause: action.cause
//     }
// }