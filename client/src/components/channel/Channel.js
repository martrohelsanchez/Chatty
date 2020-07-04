import React from 'react';

import styles from './channel.module.css';

function Channel({channel, lastMessageIndex}) {
    return (
        <div className={styles.channelContainer}>
            <div className={styles.profilePicHolder}></div>
            <div className={styles.msgPrevContainer}>
                <div className={styles.channelName}>
                    {channel.kausap}
                </div>
                <span className={styles.senderName}>
                    {channel.messages[lastMessageIndex].from}:{' '}
                </span>
                <span className={styles.lastMsgPrev}>
                    {channel.messages[lastMessageIndex].message}
                </span>
            </div>
        </div>
    )
}

export default Channel;