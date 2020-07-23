import React, { useState, useEffect, useContext } from 'react';
import {useHistory} from 'react-router-dom';

import ContactsPane from '../contactsPane/ContactsPane';
import MessagePane from '../messagesPane/messagesPane';
import {UserInfoContext} from '../../App';

export const CurrConvContext = React.createContext(null);

function Chat() {
    const [currConv, setCurrConv] = useState('');
    const userInfo = useContext(UserInfoContext);
    const history = useHistory();
    
    if (!userInfo) {
        history.push('/logIn');
        //returning null to prevent returning the ContactsPane and MessagePane components
        return null;
    }

    return (
        <CurrConvContext.Provider value={[currConv, setCurrConv]}>
            <ContactsPane />
            <MessagePane />
        </CurrConvContext.Provider>    
    )
}

export default Chat;