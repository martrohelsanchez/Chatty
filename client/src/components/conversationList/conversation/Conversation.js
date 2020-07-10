import React from 'react';

import styles from './conversation.module.css';

function Conversation({conv}) {
    return (
        <div className={styles.conversationContainer}>
            <div className={styles.profilePicHolder}></div>
            <div className={styles.msgPrevContainer}>
                <div className={styles.conversationName}>
                    {conv.conversation_name}
                </div>
                <span className={styles.senderName}>
                    {conv.messages[lastMessageIndex].from}:{' '}
                </span>
                <span className={styles.lastMsgPrev}>
                    {conv.messages[lastMessageIndex].message}
                </span>
            </div>
        </div>
    ) 
}

export default Conversation