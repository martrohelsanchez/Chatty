import React from 'react';

import styles from './messagesPane.module.css'
import InputBar from '../inputBar/InputBar'
import Messages from '../messages/messages'

function MessagePane() {
    return (
        <div className={styles.messagePaneContainer}>
            <Messages />
            <InputBar />
        </div>
    )
}

export default MessagePane;