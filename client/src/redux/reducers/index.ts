import {combineReducers} from 'redux';

import conversations from './conversations';
import userInfo from './userInfo';

const rootReducer = combineReducers({
    conversations,
    userInfo
});

export default rootReducer