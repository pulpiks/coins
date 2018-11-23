import { RENDER_CROWD } from "../types/types";

const defaultState = {
    renderCrowd: false
};

type RenderCrowdAction = {
    type: typeof RENDER_CROWD
}

type Action = RenderCrowdAction

// XXX maybe this file need to be removed

export default function (state = defaultState, action: Action) {
    switch(action.type) {
        case RENDER_CROWD: 
            return {
                ...state,
                renderCrowd: true 
            }
        default: 
            return state    
    }
}