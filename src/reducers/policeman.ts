import omit from 'lodash.omit'
import * as TYPES from '../types/types'

interface PolicemanStore {
    readonly activeIds: {[k: string]: boolean}
}

const defaultState = {
    activeIds: {}
};

type CollideWithPersonAction = {
    type: typeof TYPES.PERSON_POLICEMAN_COLLIDE,
    id: string
}


type PolicemanRemoveAction = {
    type: typeof TYPES.PERSON_POLICEMAN_REMOVE,
    id: string
}

type CollideCactusAction = {
    type: typeof TYPES.COLLIDE_POLICEMAN_CACTUS,
    id: string    
}

type PolicemanAction = CollideWithPersonAction | PolicemanRemoveAction | CollideCactusAction

export default function (state: PolicemanStore = defaultState, action: PolicemanAction) {
    switch(action.type) {
        case TYPES.PERSON_POLICEMAN_COLLIDE:
            return {
                ...state,
                activeIds: {
                    ...state.activeIds,
                    [action.id]: true
                }
            };
        case TYPES.PERSON_POLICEMAN_REMOVE:
            return omit(state, [action.id]);

        case TYPES.COLLIDE_POLICEMAN_CACTUS:
            return {
                collide_id_with_cactus: action.id
            };
        default:
            return state;
    }
}