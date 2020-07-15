import React, { useContext } from 'react';

import styles from './conversation.module.css';
import {UserInfoContext} from '../../../App';

function Conversation({conv}) {
    const userInfo = useContext(UserInfoContext);
    const {last_message, is_chatroom} = conv;
    // const senderIsMe = last_message.sender_username === userInfo.username ? true : false;
    // const senderUsernamePrev = senderIsMe ? 'You' : last_message.sender_username;

    return (
        <div className={styles.conversationContainer}>
            <div className={styles.profilePicHolder}></div>
            <div className={styles.msgPrevContainer}>
                <div className={styles.conversationName}>
                    {conv.conversation_name}
                </div>
                <span className={styles.senderName}>
                    {/* {senderUsernamePrev}:' ' */}
                    SenderName:{' '}
                </span>
                <span className={styles.lastMsgPrev}>
                    {/* {last_message.message_body} */}
                    Message body
                </span>
            </div>
        </div>
    ) 
}

export default Conversation