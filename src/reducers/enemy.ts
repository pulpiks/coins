import { PERSON_POLICEMAN_COLLIDE } from '../types/types';
import { ENEMY_TYPES } from '../constants/constants';

const defaultState = {

};

export default function (state = defaultState, action) {
    switch(action.type) {
        case PERSON_POLICEMAN_COLLIDE:
            return {
                type: ENEMY_TYPES.policeman
            };
        default:
            return state;
    }
}