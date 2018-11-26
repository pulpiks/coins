import { ENEMY_TYPES } from '../constants/constants'
import { COLLIDE_PASSER } from '../types/types'

export interface PasserState {
    collided: number[]
}

const defaultState: PasserState = {
    collided: []
}

type ActionCollide = {
    type: typeof COLLIDE_PASSER,
    id: number
}

type Action = ActionCollide
// XXX maybe this file need to be removed

export default function (state = defaultState, action: Action) {
    switch(action.type) {
        case COLLIDE_PASSER:
            return {
                ...state,
                collided: (state.collided.push(action.id), state.collided)
            };
        default:
            return state;
    }
}