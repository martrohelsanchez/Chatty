import {combineReducers} from 'redux';

import messages from './messages';
import currConv from './currConv';

export default combineReducers({
    messages,
    currConv
})