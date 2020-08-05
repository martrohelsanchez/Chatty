import {combineReducers} from 'redux';

import messages from './messages';
import currConv from './currConv';
import conversations from './conversations';

export default combineReducers({
    messages,
    currConv,
    conversations
})