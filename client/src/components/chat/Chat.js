import React, {useEffect, useContext} from 'react';
import styled from 'styled-components';
import { useRouteMatch } from 'react-router-dom';

import ContactsPane from '../contactsPane/ContactsPane';
import MessagePane from '../messagesPane/messagesPane';
import InfoPane from '../infoPane/InfoPane'; 
import {socket, UserInfoContext} from '../../App';

import { useDispatch, useSelector } from 'react-redux';
import {addNewMsg, deleteConv, updateLastSeen} from '../../redux/actions/conversationsActions';

const StyledChat = styled.div`
    display: flex;
    background-color: #ffffff;
    width: 100vw;
    height: 100vh;
    font-family: ${({theme}) => theme.font.primary};
    color: white;
`

function Chat() {
    const match = useRouteMatch('/chat/:convId');
    const currConvId = match ? match.params.convId : null;
    const currConv = useSelector((state => state.conversations.find(conv => conv._id === state.currConv._id))) || {};
    const dispatch = useDispatch();
    const user = useContext(UserInfoContext);

    useEffect(() => {
        socket.emit('join room', user.userId);

        socket.on('sendMsg', newMsg => {
            dispatch(addNewMsg(newMsg.conversation_id, newMsg));
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

    useEffect(() => {
        return () => {
            if (currConv.convHasCreated === false) {
                console.log('deleted: ', currConvId);
                dispatch(deleteConv(currConvId));
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