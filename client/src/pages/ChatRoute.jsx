import React from 'react';

import Chat from '../components/chat/Chat';
import { useSelector } from 'react-redux';
import { useHistory, Redirect } from 'react-router-dom';

function ChatRoute() {
    const userInfo = useSelector(state => state.userInfo);

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