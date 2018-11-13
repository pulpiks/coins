import { PERSON_POLICEMAN_COLLIDE, CHANGE_MOOD, REDUCE_MOOD } from '../types/types'
import { MOOD } from '../constants/constants'

interface MoodStore {
    readonly total: number
}

const defaultState = {
    total: 100
}

type PersonPolicemanCollideAction = {
    readonly type: typeof PERSON_POLICEMAN_COLLIDE,
}

type ChangeMoodAction = {
    readonly type: typeof CHANGE_MOOD,
    readonly incr: number
}

type ReduceMoodAction = {
    readonly type: typeof REDUCE_MOOD,
    readonly cause: string
}

type MoodAction = PersonPolicemanCollideAction | ChangeMoodAction | ReduceMoodAction

export default function (state = defaultState, action: MoodAction) {
    switch(action.type) {
        case PERSON_POLICEMAN_COLLIDE:
            let total = state.total - MOOD.step < 0 ? 0 : state.total - MOOD.step;
            return {
                total: total < 0 ? 0 : total
            };
        case CHANGE_MOOD:
            return {
                ...state,
                total: state.total + action.incr
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