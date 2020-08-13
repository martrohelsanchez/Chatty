import React, { useContext } from 'react';

import styles from './conversation.module.css';
import {UserInfoContext} from '../../../App';

import {useDispatch} from 'react-redux';
import {setCurrConv} from '../../../redux/actions/currConvActions';

function Conversation({conv}) {
    const user = useContext(UserInfoContext);
    const dispatch = useDispatch();
    
    if (conv.convHasCreated === false) return null;

    const {last_message, is_group_chat, group_name, members, members_meta} = conv;
    const isRead = members_meta.find(member => member.user_id === user.userId).last_seen >= last_message.date_sent;
    const read = isRead ? '' : styles.unread;
    let conversationName;


    if (is_group_chat) {
        conversationName = group_name;
    } else {
        conversationName = members.find(member => member._id !== user.userId).username;
    }

    function handleOpenConvo() {
        dispatch(setCurrConv(conv))
    }

    return (
        <div className={styles.conversationContainer} onClick={handleOpenConvo}>
            <div className={styles.profilePicHolder}></div>
            <div className={styles.msgPrevContainer}>
                <div className={`${styles.conversationName} ${read}`}>
                    {conversationName}
                </div>
                <span className={`${styles.senderName} ${read}`}>
                    {last_message.sender_username}:{' '}
                </span>
                <span className={`${styles.lastMsgPrev} ${read}`}>
                    {last_message.message_body}
                </span>
            </div>
        </div>
    ) 
}

export default Conversation