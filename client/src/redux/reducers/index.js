import {combineReducers} from 'redux';

import currConv from './currConv';
import conversations from './conversations';

export default combineReducers({
    currConv,
    conversations
})