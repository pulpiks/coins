import { ENEMY_COLLIDE } from '../types/types';

const defaultState = {
    activeIds: {}
};

export default function (state = defaultState, action) {
    switch(action.type) {
        case ENEMY_COLLIDE:
            return {
                type: action.type
            };
        default:
            return state;
    }
}