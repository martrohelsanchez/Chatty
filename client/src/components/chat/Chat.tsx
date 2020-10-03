import React, {useEffect} from 'react';
import styled from 'styled-components';
import {useRouteMatch} from 'react-router-dom';

import ContactsPane from 'components/conversationPane/ConversationPane';
import MessagePane from 'components/messagesPane/MessagesPane';
import InfoPane from 'components/infoPane/InfoPane'; 
import {socket} from 'App';
import {findConvInRedux} from 'shared/utils/helpers';
import {getTheConversationReq, updateMsgIsDeliveredReq} from 'api/APIUtils';

import {useDispatch, useSelector} from 'react-redux';
import {addNewMsg, deleteConv, updateLastSeen, updateDelivered, addConv, updateLastMsg} from 'redux/actions/conversationsActions';
import {rootState} from 'redux/store';
import {UserInfo} from 'redux/actions/userInfoActions';
import {Message} from 'shared/types/dbSchema';

const StyledChat = styled.div`
    display: flex;
    background-color: #ffffff;
    width: 100vw;
    height: 100vh;
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

        socket.on('gotMessage', async (newMsg: Message) => {
            if (!newMsg.is_delivered) {
                updateMsgIsDeliveredReq(newMsg.conversation_id, newMsg._id);
                updateDelivered(newMsg.conversation_id, newMsg._id);
            }

            const convFromRedux = findConvInRedux(newMsg.conversation_id)

            if (convFromRedux) {
                if (convFromRedux.messages) {
                    dispatch(addNewMsg(newMsg.conversation_id, newMsg, true));
                } else {
                    //if messages is not yet populated, only update the last_message field
                    dispatch(updateLastMsg(newMsg.conversation_id, newMsg));
                }
            } else {
                //Conv doesn't exist in redux. Get the conversation doc in DB
                const convFromDb = await getTheConversationReq(newMsg.conversation_id);
                dispatch(addConv({
                    ...convFromDb,
                    convHasCreated: true
                }));
            }
        });

        socket.on('seen', (convId, userId, newSeen) => {
            if (userId !== user.userId) {
                //The seen must not from the current user
                dispatch(updateLastSeen(convId, userId, newSeen));
            }
        });

        socket.on('msgDelivered', (convId: string, msgId: string) => {
            dispatch(updateDelivered(convId, msgId));
        })
    }, []);

    useEffect(() => {
        if (currConvId) {
            //Start receiving events on this conversation room
            socket.emit('join room', currConvId);
        }

        return () => {
            //Stop receiving events from the previous opened conversation 
            socket.emit('leave room', currConvId);
        }
    }, [currConvId])

    useEffect(() => {
        /* 
            Before the user switches to other conversation, 
            delete the conversation if it doesn't exist in DB
        */
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