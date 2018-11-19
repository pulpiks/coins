import { CHANGE_MOOD, REDUCE_MOOD } from '../types/types'
import { MOOD } from '../constants/constants'

interface MoodStore {
    readonly total: number
}

const defaultState = {
    total: 100
}


type ChangeMoodAction = {
    readonly type: typeof CHANGE_MOOD,
    readonly incr: number
}

type ReduceMoodAction = {
    readonly type: typeof REDUCE_MOOD,
    readonly cause: string
}

type MoodAction = ChangeMoodAction | ReduceMoodAction

export default function (state = defaultState, action: MoodAction) {
    switch(action.type) {
        case CHANGE_MOOD:
            let total = state.total + action.incr < 0 ? 0 : state.total + action.incr;
            return {
                ...state,
                total: total
            } 
        case REDUCE_MOOD:
            return {
                ...state,
                cause: action.cause
            }      
        default:
            return state;
    }
}