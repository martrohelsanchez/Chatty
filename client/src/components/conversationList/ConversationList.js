import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';

import styles from './conversationList.module.css';
import Conversation from './conversation/Conversation';
import Loading from '../loading/Loading';
import { getConversationsReq, updateMsgIsDeliveredReq } from '../../api/APIUtils';
import { UserInfoContext } from '../../App';

import {useDispatch, useSelector} from 'react-redux';
import {setCurrConv} from '../../redux/actions/currConvActions';
import {retrieveConversations} from '../../redux/actions/conversationsActions';

function ConversationList() {
    const conversations = useSelector(state => state.conversations);
    const [err, setErr] = useState(null);
    const dispatch = useDispatch();
    const user = useContext(UserInfoContext);

    useEffect(() => {
        if (conversations.length === 0) {
            getConversationsReq(10, null, data => {
                dispatch(retrieveConversations(data.conversations));
                checkDeliver(data);
            }, err => {
                console.error(err.message)
                setErr('Something went wrong')
            })
        }
    }, []);

    //Check if the last message of a conversation hasn't been delivered
    function checkDeliver(data) {
        const conversations = data.conversations;

        for (let conversation of conversations) {
            const {last_message, _id} = conversation;

            if (last_message.sender_id !== user.userId && !last_message.is_delivered) {
                updateMsgIsDeliveredReq(_id, last_message.sender_id);
            }
        }
    }

    if (conversations.length === 0) {
        return <Loading />
    } else if (err) {
        return <div>{err}</div>
    }

    const renderConversations = conversations.map(conv => {
        return <Conversation key={conv._id} conv={conv} />
    });

    return (
      <div className={styles.conversationListContainer}>
        {renderConversations}
      </div>
    );
}

export default ConversationList