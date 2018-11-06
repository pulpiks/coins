import { GAME_OVER } from '../types/types'
import { GameOverAction } from '../actions';

interface FinalState {}

const defaultState = {}

type Action = GameOverAction

export default function final(state: FinalState = defaultState, action: Action) {
    switch(action.type) {
        case GAME_OVER: 
            return {
                ...state,
                status: 'fail',
                msg: action.msg,
            }
        default: return state    
    }
}