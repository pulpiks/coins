import * as TYPES from '../types/types';
import { COINS } from '../constants/constants';

const defaultState = {
    cactuses: 0,
    money: COINS.startSum
};

export default function (state = defaultState, action) {
    switch(action.type) {
        case TYPES.UPDATE_SCORE:
            return {
                ...state,
                cactuses: state.cactuses + action.diff
            };
        case TYPES.UPDATE_MONEY:
            return {
                ...state,
                money: state.money + action.money
            }
        case TYPES.ADD_CACTUS:
            return {
                ...state,
                cactuses: state.cactuses + 1
            };
        case TYPES.THROW_CACTUS:
            return {
                ...state,
                cactuses: state.cactuses - 1
            };
        default:
            return state;
    }
}