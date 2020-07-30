import React, {useState, useEffect} from 'react';
import axios from 'axios';

import styles from './conversationList.module.css';
import Conversation from './conversation/Conversation';
import Loading from '../loading/Loading';
import {socket} from '../../App';

import {useDispatch} from 'react-redux';
import {setCurrConv} from '../../redux/actions/currConvActions';

function ConversationList() {
    const [conversations, setConversations] = useState([]);
    const [err, setErr] = useState(null);
    const [isInitialRender, setIsInitialRender] = useState(true);
    const dispatch = useDispatch();

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
                    dispatch(setCurrConv(newConversations[0]));
                }
                setConversations([...conversations, ...newConversations]);
            })
            .catch(err => {
                console.error(err.message)
                setErr('Something went wrong')
            })
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