import React from 'react';

import styles from './conversation.module.css';

import {useDispatch} from 'react-redux';
import {setCurrConv} from '../../../redux/actions/currConvActions';

function Conversation({conv}) {
    const dispatch = useDispatch();

    function handleOpenConvo() {
        dispatch(setCurrConv(conv))
    }

    return (
        <div className={styles.conversationContainer} onClick={handleOpenConvo}>
            <div className={styles.profilePicHolder}></div>
            <div className={styles.msgPrevContainer}>
                <div className={styles.conversationName}>
                    {conv.conversation_name}
                </div>
                <span className={styles.senderName}>
                    SenderName:{' '}
                </span>
                <span className={styles.lastMsgPrev}>
                    Message body
                </span>
            </div>
        </div>
    ) 
}

export default Conversation