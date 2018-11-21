import * as TYPES from '../types/types'
import { COINS } from '../constants/constants'

export interface ScoreStore {
   readonly cactuses: number,
   readonly money: number 
}

const defaultState = {
    cactuses: 0,
    money: COINS.startSum
}

type UpdateScore = {
    type: typeof TYPES.UPDATE_SCORE,
    diff: number,
}

type UpdateMoney = {
    type: typeof TYPES.UPDATE_MONEY,
    amount: number,
}

type AddCactus = {
    type: typeof TYPES.ADD_CACTUS,
}

type ThrowCactus = {
    type: typeof TYPES.THROW_CACTUS
}

type Action = UpdateScore | UpdateMoney | AddCactus | ThrowCactus

export default function (state: ScoreStore = defaultState, action: Action) {
    switch(action.type) {
        case TYPES.UPDATE_SCORE:
            return {
                ...state,
                cactuses: state.cactuses + action.diff
            }
        case TYPES.UPDATE_MONEY:
            const money = state.money + action.amount
            return {
                ...state,
                money: money < 0 ? 0 : money
            }
        case TYPES.ADD_CACTUS:
            return {
                ...state,
                cactuses: state.cactuses + 1
            }
        case TYPES.THROW_CACTUS:
            return {
                ...state,
                cactuses: state.cactuses - 1
            }
        default:
            return state;
    }
}