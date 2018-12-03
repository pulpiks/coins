import {
    createStore,
    combineReducers
} from 'redux'

import policeman, { PolicemanState } from '../reducers/policeman'
import enemy, { EnemyState } from '../reducers/enemy'
import mood, { MoodState } from '../reducers/mood'
import score, { ScoreState } from '../reducers/score'
import official, { OfficialState } from '../reducers/official'
import passers, { PasserState } from '../reducers/passer'
import events, { EventsState } from '../reducers/events'
import statusGame, { FinalState } from '../reducers/final'
import * as TYPES from '../types/types';

export interface State {
    readonly policeman: PolicemanState,
    readonly enemy: EnemyState,
    readonly mood: MoodState,
    readonly score: ScoreState,
    readonly official: OfficialState,
    readonly passers: PasserState,
    readonly events: EventsState,
    readonly statusGame: FinalState,
}

const appReducer = combineReducers<State>({
    policeman,
    enemy,
    mood,
    score,
    official,
    passers,
    events,
    statusGame,
});


const rootReducer = (state: State, action: any) => {
    if (action.type === TYPES.START_GAME) {
        state = undefined
    }

    return appReducer(state, action)
} 

const store = createStore(
    rootReducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

export default store