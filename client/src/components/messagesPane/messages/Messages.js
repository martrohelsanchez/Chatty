import React, {useState, useEffect, useContext } from 'react';
import axios from 'axios';

// import styles from './messages.module.css';
import Message from './message/Message';
import { socket } from '../../../App';
import {CurrConvContext} from '../../chat/Chat';

function Messages({userInfo}) {
    const [messages, setMessages] = useState([]);
    const [currConv, setCurrConv] = useContext(CurrConvContext);
    const [err, setErr] = useState(null);

    useEffect(()=> {
        const currConvId = currConv._id;

        if (currConvId === undefined) {
            return undefined
        }

        axios.get(`/chat/conversations/${currConvId}/messages`, {
            // before: '',
            limit: 10
        })
            .then(res => {
                setMessages(res.data.messages)
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
                setMessages([...messages, newMsg]);
            }
        });
    })

    const renderMessages = messages.map(message => {
        return <Message key={message._id} message={message}/>
    })

    return (
        <div>
            {err ? err : renderMessages}
        </div>
    )
}

export default Messages;