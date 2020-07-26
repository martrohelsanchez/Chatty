import React, {useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';

// import styles from './messages.module.css';
import Message from './message/Message';
import Loading from '../../loading/Loading';
import { socket } from '../../../App';

import {useDispatch, useSelector} from 'react-redux';
import {setInitialMsg, addNewMsg} from '../../../redux/actions/messagesActions';

function Messages() {
    const currConv = useSelector(state => state.currConv);
    const {messages} = useSelector(state => state.messages.find(conv => conv.convId === state.currConv._id)) || [];
    const dispatch = useDispatch();
    const [err, setErr] = useState(null);

    //Set the initial messages of a conversation
    useEffect(()=> {
        if (!currConv) {
            return undefined;
        } else if (messages) {
            //The initial messages of this conversations is already set in the redux store, so no need to req data
            return undefined
        }

        const currConvId = currConv._id;

        axios.get(`/chat/conversations/${currConvId}/messages`, {
            limit: 10
        })
            .then(res => {
                const {messages} = res.data;
                dispatch(setInitialMsg(currConvId, messages))
            })
            .catch(err => {
                console.error(err)
            })
    }, [currConv]);
    
    useEffect(() => {
        socket.on('sendMsg', newMsg => {
            const currConvId = currConv._id;

            //add the new msg if the newMsg is for the current conversation
            if (currConvId === newMsg.conversation_id) {
                dispatch(addNewMsg(currConvId, newMsg));
            }
        });
    })

    if (messages === undefined) {
        return <Loading />
    } else if (err) {
        return <div>{err}</div>
    }

    const renderMessages = messages.map(message => {
        return <Message key={message._id} message={message}/>
    })

    return (
        <div>
            {renderMessages}
        </div>
    )
}

export default Messages;