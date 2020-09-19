import React, {useEffect} from 'react';
import styled from 'styled-components';
import {useRouteMatch} from 'react-router-dom';

import ContactsPane from '../conversationPane/ConversationPane';
import MessagePane from '../messagesPane/messagesPane';
import InfoPane from '../infoPane/InfoPane'; 
import {socket} from '../../App';

import {useDispatch, useSelector} from 'react-redux';
import {addNewMsg, deleteConv, updateLastSeen} from '../../redux/actions/conversationsActions';
import {rootState} from '../../redux/store';
import {UserInfo} from 'redux/actions/userInfoActions';

const StyledChat = styled.div`
    display: flex;
    background-color: #ffffff;
    width: 100vw;
    height: 100vh;
    font-family: ${({theme}) => theme.font.primary};
    color: white;
`

const Chat = () => {
    const match = useRouteMatch<{convId: string}>('/chat/:convId');
    const currConvId = match ? match.params.convId : null;
    const currConv = useSelector(((state: rootState) => state.conversations.find(conv => conv._id === currConvId)));
    const dispatch = useDispatch();
    const user = useSelector((state: rootState) => state.userInfo as UserInfo);

    useEffect(() => {
        socket.emit('join room', user.userId);

        socket.on('sendMsg', newMsg => {
            dispatch(addNewMsg(newMsg.conversation_id, newMsg, true));
        });

        socket.on('seen', (convId, userId, newSeen) => {
            if (userId !== user.userId) {
                //The seen must not came from the current user
                dispatch(updateLastSeen(convId, userId, newSeen));
            }
        });
    }, []);

    useEffect(() => {
        if (currConvId) {
            socket.emit('join room', currConvId);
        }

        return () => {
            socket.emit('leave room', currConvId);
        }
    }, [currConvId])

    /* 
        Before the user switches to other conversation, 
        delete the conversation if it doesn't exist in DB
    */
    useEffect(() => {
        return () => {
            if (currConv?.convHasCreated === false) {
                dispatch(deleteConv(currConv._id));
            }
        }
    }, [currConvId]);

    return (
        <StyledChat>
            <ContactsPane />
            <MessagePane />
            <InfoPane />
        </StyledChat>
    )
}

export default Chat;