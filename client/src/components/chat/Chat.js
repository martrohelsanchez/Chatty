import React, { useContext } from 'react';
import {useHistory} from 'react-router-dom';

import ContactsPane from '../contactsPane/ContactsPane';
import MessagePane from '../messagesPane/messagesPane';
import {UserInfoContext} from '../../App';

function Chat() {
    const userInfo = useContext(UserInfoContext);
    const history = useHistory();
    
    if (!userInfo) {
        history.push('/logIn');
        //returning null to prevent returning the ContactsPane and MessagePane components
        return null;
    }

    return (
        <>
            <ContactsPane />
            <MessagePane />
        </>
    )
}

export default Chat;