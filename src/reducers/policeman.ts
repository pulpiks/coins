import * as TYPES from '../types/types';

const defaultState = {
    activeIds: {}
};

export default function (state = defaultState, action) {
    switch(action.type) {
        case TYPES.PERSON_POLICEMAN_COLLIDE:
            return {
                ...state,
                activeIds: {
                    ...state.activeIds,
                    [action.id]: true
                }
            };
        case TYPES.PERSON_POLICEMAN_REMOVE:
            const newState = { ...state };
            delete newState[action.id];
            return newState;

        case TYPES.COLLIDE_POLICEMAN_CACTUS:
            return {
                collide_id_with_cactus: action.id
            };
        default:
            return state;
    }
}