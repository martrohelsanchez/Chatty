import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';

import ContactsPane from '../contactsPane/ContactsPane';
import MessagePane from '../messagesPane';

function Chat({ userInfo, setUserInfo}) {
    const history = useHistory();

    if (!userInfo) {
        history.push('/logIn');
        //returning null to prevent returning the ContactsPane and MessagePane components
        return null;
    }

    return (
        <>
            <ContactsPane userInfo={userInfo}/>
            <MessagePane userInfo={userInfo}/>
        </>
    )
}

export default Chat;