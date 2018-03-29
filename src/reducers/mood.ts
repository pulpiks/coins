import { PERSON_POLICEMAN_COLLIDE } from '../types/types';
import { MOOD } from '../constants/constants';

const defaultState = {
    total: 100
};

export default function (state = defaultState, action) {
    switch(action.type) {
        case PERSON_POLICEMAN_COLLIDE:
            let total = state.total - MOOD.step < 0 ? 0 : state.total - 1;
            return {
                total: total < 0 ? 0 : total
            };
        default:
            return state;
    }
}