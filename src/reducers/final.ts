import { GAME_OVER } from '../types/types'

interface FinalState {}

const defaultState = {}

type GameOverAction = {
    readonly type: typeof GAME_OVER,
    readonly msg: string,
}

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