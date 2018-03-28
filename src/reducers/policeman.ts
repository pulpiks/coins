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
        default:
            return state;
    }
}