import { GAME_OVER, HAPPY_END } from '../types/types'

export interface FinalState {
    readonly [k: string]: string 
}

const defaultState = {
    status: ''
}

type GameOverAction = {
    readonly type: typeof GAME_OVER,
    readonly msg: string,
}

type HappyEndAction = {
    readonly type: typeof HAPPY_END,
}

type Action = GameOverAction | HappyEndAction

export default function statusGame(state: FinalState = defaultState, action: Action) {
    switch(action.type) {
        case GAME_OVER: 
            return {
                ...state,
                status: 'fail',
                msg: action.msg,
            }
        case HAPPY_END:
            return {
                ...state,
                status: 'end'
            }
        default: return state    
    }
}