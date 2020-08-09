import React, { useState } from 'react';

import styles from './messagesPane.module.css'
import InputBar from '../inputBar/InputBar'
import MessageList from './messages/MessageList'

function MessagePane() {
    const [isDelivered, setIsDelivered] = useState(false);
    
    return (
        <div className={styles.messagePaneContainer}>
            <MessageList isDelivered={isDelivered} />
            <InputBar />
        </div>
    )
}

export default MessagePane;