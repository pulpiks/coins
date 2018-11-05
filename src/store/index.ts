import {
    createStore,
    combineReducers
} from 'redux'

import policeman from '../reducers/policeman'
import enemy from '../reducers/enemy'
import mood from '../reducers/mood'
import score from '../reducers/score'

const rootReducer = combineReducers({
    policeman,
    enemy,
    mood,
    score
});

const store = createStore(
    rootReducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

export default store