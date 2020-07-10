import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Conversation from './conversation/Conversation';
import Loading from '../loading/loading';

function ConversationList() {
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
                setConversations(prev => {
                    return [
                        ...prev,
                        ...newConversations
                    ]
                });
            })
            .catch(err => {
                console.error(err.message)
                setErr('Something went wrong')
            })
    }

    const renderConversations = conversations.map(conv => {
        return <Conversation conv={conv} />
    })

    return (
        <div>
            {
                isLoading ? 
                    <Loading />
                :
                    {renderConversations}
            }
        </div>
    )
}

export default ConversationList