import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import styles from './conversationList.module.css';
import Conversation from './conversation/Conversation';
import Loading from '../loading/Loading';
import {UserInfoContext} from '../../App';

function ConversationList() {
    const userInfo = useContext(UserInfoContext);
    const [conversations, setConversations] = useState([]);
    const [err, setErr] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getConversations();
    }, []);

    function getConversations() {
        axios.get('/chat/conversations', {
            params: {
                // before: ,
                limit: 10
            }
        })
            .then(res => {
                const newConversations = res.data.conversations
                setConversations([...conversations, ...newConversations]);
                setIsLoading(false)
            })
            .catch(err => {
                console.error(err.message)
                setErr('Something went wrong')
            })
    }

    const renderConversations = conversations.map(conv => {
        return <Conversation conv={conv} />
    });

    return (
      <div className={styles.conversationListContainer}>
        {isLoading ? <Loading /> : renderConversations}
        {err}
      </div>
    );
}

export default ConversationList