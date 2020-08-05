import React from 'react';

import styles from './messagesPane.module.css'
import InputBar from '../inputBar/InputBar'
import MessageList from './messages/MessageList'

function MessagePane() {
    return (
        <div className={styles.messagePaneContainer}>
            <MessageList />
            <InputBar />
        </div>
    )
}

export default MessagePane;