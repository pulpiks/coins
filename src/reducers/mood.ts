import { PERSON_POLICEMAN_COLLIDE } from '../types/types'
import { MOOD } from '../constants/constants'

interface MoodStore {
    readonly total: number
}

const defaultState = {
    total: 100
}

type PersonPolicemanCollideAction = {
    type: typeof PERSON_POLICEMAN_COLLIDE,
}

type MoodAction = PersonPolicemanCollideAction

export default function (state = defaultState, action: MoodAction) {
    switch(action.type) {
        case PERSON_POLICEMAN_COLLIDE:
            let total = state.total - MOOD.step < 0 ? 0 : state.total - MOOD.step;
            return {
                total: total < 0 ? 0 : total
            };
        default:
            return state;
    }
}