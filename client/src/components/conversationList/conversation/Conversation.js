import React, { useContext } from 'react';

import styles from './conversation.module.css';
import {UserInfoContext} from '../../../App';

import {useDispatch} from 'react-redux';
import {setCurrConv} from '../../../redux/actions/currConvActions';

function Conversation({conv}) {
    const userInfo = useContext(UserInfoContext);
    const dispatch = useDispatch();
    const {last_message, is_chatroom} = conv;
    // const senderIsMe = last_message.sender_username === userInfo.username ? true : false;
    // const senderUsernamePrev = senderIsMe ? 'You' : last_message.sender_username;

    function handleOpenConvo() {
        dispatch(setCurrConv(conv))
        // setCurrConv(conv);
    }

    return (
        <div className={styles.conversationContainer} onClick={handleOpenConvo}>
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