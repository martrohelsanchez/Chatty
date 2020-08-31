import {combineReducers} from 'redux';

import currConv from './currConv';
import conversations from './conversations';
import userInfo from './userInfo';

export default combineReducers({
    currConv,
    conversations,
    userInfo
});