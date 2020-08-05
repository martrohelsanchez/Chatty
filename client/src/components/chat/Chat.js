import React, { useContext, useEffect } from 'react';
import {useHistory} from 'react-router-dom';

import ContactsPane from '../contactsPane/ContactsPane';
import MessagePane from '../messagesPane/messagesPane';
import {UserInfoContext, socket} from '../../App';

import { useDispatch, useSelector } from 'react-redux';
import {addNewMsg, updateLastSeen} from '../../redux/actions/conversationsActions';

let currConvId;

function Chat() {
    currConvId = useSelector(state => state.currConv._id);
    const userInfo = useContext(UserInfoContext);
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        socket.on('sendMsg', newMsg => {
            //dispatch if the newMsg is for the current conversation
            console.log('received a message')
            if (currConvId === newMsg.conversation_id) {
                dispatch(addNewMsg(currConvId, newMsg));
            }
        });

        // socket.on('seen', (convId, seenMeta) => {
        //     dispatch(updateLastSeen(convId, seenMeta));
        // });
    }, [])

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