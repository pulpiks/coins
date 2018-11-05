import { PERSON_POLICEMAN_COLLIDE } from '../types/types';
import { ENEMY_TYPES } from '../constants/constants';

const defaultState = {

};

// XXX maybe this file need to be removed

export default function (state = defaultState, action: any) {
    switch(action.type) {
        case PERSON_POLICEMAN_COLLIDE:
            return {
                type: ENEMY_TYPES.policeman
            };
        default:
            return state;
    }
}