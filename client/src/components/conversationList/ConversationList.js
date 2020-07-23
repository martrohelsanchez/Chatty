import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import styles from './conversationList.module.css';
import Conversation from './conversation/Conversation';
import Loading from '../loading/Loading';
import {CurrConvContext} from '../chat/Chat';
import {socket} from '../../App';

function ConversationList() {
    const [conversations, setConversations] = useState([]);
    const [err, setErr] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialRender, setIsInitialRender] = useState(true);
    const [currConv, setCurrConv] = useContext(CurrConvContext);

    useEffect(() => {
        getConversations();

        socket.on('sendMsg', newMsg =>{
            for (let i in conversations) {
                const convId = conversations[i]._id;

                //finds the conversation of the new msg on the current loaded conversation list
                if (convId === newMsg.conversation_id) {
                    const updateConversations = [...conversations];
                    const {last_message, last_updated} = updateConversations[convId];

                    last_message.message_body = newMsg.message_body
                    last_message.sender_username = newMsg.sender_username
                    last_updated = newMsg.date_sent;

                    //places the updated conversation to the top
                    updateConversations.unshift(updateConversations[convId]);
                    updateConversations.splice(i, 1);

                    setConversations(updateConversations);
                }

                //finds the conversation of the new msg on the database
                axios.get('/chat/conversations')
                    .then(res => {
                        const newConversation = res.data;
                        setConversations([newConversation, ...conversations])
                    })
                    .catch(err => {
                        console.log(err.message);
                        setErr('Something went wrong')
                    })
            }
        })
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
                if (isInitialRender) {
                    setCurrConv(newConversations[0])
                }
                setConversations([...conversations, ...newConversations]);
                setIsLoading(false)
            })
            .catch(err => {
                console.error(err.message)
                setErr('Something went wrong')
            })
    }

    const renderConversations = conversations.map(conv => {
        return <Conversation key={conv._id} conv={conv} />
    });

    return (
      <div className={styles.conversationListContainer}>
        {isLoading ? <Loading /> : renderConversations}
        {err}
      </div>
    );
}

export default ConversationList