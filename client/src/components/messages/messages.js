import React, { useContext, useState, useEffect } from 'react';

import styles from './messages.module.css';
import Message from './message/Message';
import { SocketContext } from '../../App';

function Messages() {
    const [messages, setMessages] = useState([]);
    const socket = useContext(SocketContext);

    socket.on('receive message', message => {
        setMessages(prev => {
            return [
                ...prev,
                message
            ]
        })
    })

    const renderMessages = messages.map(message => {
        return <Message from={message.from} message={message.message}/>
    })

    return (
        <div>
            <Message from="zaira" message="pasado ka sa pup!"/>
            <Message from="rohel" message="Hala weh!"/>
        </div>
    )
}

export default Messages;