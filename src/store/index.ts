import {
    createStore,
    combineReducers
} from 'redux';

import policeman from '../reducers/policeman';
import enemy from '../reducers/enemy';

const rootReducer = combineReducers({
    policeman,
    enemy
});

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;