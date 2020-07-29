import React, { useState } from 'react';

import styles from './messagesPane.module.css'
import InputBar from '../inputBar/InputBar'
import Messages from './messages/Messages'
import { useRef } from 'react';

function MessagePane() {
    return (
        <div className={styles.messagePaneContainer}>
            <Messages />
            <InputBar />
        </div>
    )
}

export default MessagePane;