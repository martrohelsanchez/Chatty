import React, {useState, useEffect } from 'react';

// import styles from './messages.module.css';
import Message from './message/Message';
import { socket } from '../../App';

function Messages({userInfo}) {
    const [messages, setMessages] = useState([]);

    useEffect(()=> {
        socket.on("receive message", (message) => {
            setMessages(prev => {
                return [...prev, message];
            });
        });
    }, [])

    const renderMessages = messages.map(message => {
        return <Message key={message.id} from={message.from} message={message.message}/>
    })

    return (
        <div>
            {renderMessages}
        </div>
    )
}

export default Messages;