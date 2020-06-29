import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';

import ContactsPane from '../contactsPane/ContactsPane';
import MessagePane from '../messagesPane';

function Chat({ userInfo, setUserInfo}) {
    // const [userInfo, setUserInfo] = useState();

    // useEffect(() => {
    //     console.log('username: ', username.username)
    //     axios.post("http://localhost:5000/chat", {
    //         username: username.username
    //     })
    //         .then(({data}) => {
    //             console.log(data)
    //             if (data.isAuth) {
    //                 setUserInfo(data);
    //             }
    //         })
    //         .catch(err => {
    //             console.log('not authorized')
    //         })
    // }, []);

    return (
        <>
            <ContactsPane userInfo={userInfo}/>
            <MessagePane userInfo={userInfo}/>
        </>
    )
}

export default Chat;