import {
    createStore,
    combineReducers
} from 'redux';

import policeman from '../reducers/policeman';

const rootReducer = combineReducers({
    policeman
});

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;