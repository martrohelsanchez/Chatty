import React from 'react';

import Chat from '../components/chat/Chat';
import {useSelector} from 'react-redux';
import {Redirect} from 'react-router-dom';

import {rootState} from "../redux/store";

const ChatRoute = () => {
    const userInfo = useSelector((state: rootState ) => state.userInfo);

    return (
        <>
            {userInfo ? (
                <Chat />
            ) : (
                <Redirect to='logIn' />
            )}
        </>
    )
}

export default ChatRoute;