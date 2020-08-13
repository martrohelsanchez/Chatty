import React, { useState } from 'react';

import styles from './messagesPane.module.css'
import InputBar from '../inputBar/InputBar'
import MessageList from './messages/MessageList'

import { useSelector } from 'react-redux';

function MessagePane() {
    const [isDelivered, setIsDelivered] = useState(false);
    const currConv = useSelector(state => state.conversations.find(conv => conv._id === state.currConv._id));

    return (
        <div className={styles.messagePaneContainer}>
            <MessageList isDelivered={isDelivered} currConv={currConv}/>
            <InputBar />
        </div>
    )
}

export default MessagePane;