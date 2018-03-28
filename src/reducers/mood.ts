import { REDUCE_MOOD } from '../types/types';

const defaultState = {
    total: 100
};

export default function (state = defaultState, action) {
    switch(action.type) {
        case REDUCE_MOOD:
            return {
                total: (action.cause === 'POLICEMAN') ? state.total - 3 : state.total - 1;
            };
        default:
            return state;
    }
}