import React, {useState, useEffect } from 'react';

import styles from './messages.module.css';
import Message from './message/Message';
import { socket } from '../../App';

function Messages() {
    const [messages, setMessages] = useState([]);

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
            {renderMessages}
        </div>
    )
}

export default Messages;