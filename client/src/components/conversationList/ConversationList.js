import React, {useState, useEffect} from 'react';
import axios from 'axios';

import styles from './conversationList.module.css';
import Conversation from './conversation/Conversation';
import Loading from '../loading/Loading';
import {socket} from '../../App';

import {useDispatch, useSelector} from 'react-redux';
import {setCurrConv} from '../../redux/actions/currConvActions';
import {retrieveConversations} from '../../redux/actions/conversationsActions';

function ConversationList() {
    const conversations = useSelector(state => state.conversations);
    const state = useSelector(state => state);
    const [err, setErr] = useState(null);
    const [isInitialRender, setIsInitialRender] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        getConversations();
    }, []);

    async function getConversations() {
        try {
            const {data} = await axios.get('/chat/conversations', {
                params: {  
                    // before: ,
                    limit: 10
                }
            })

            if (isInitialRender) {
                dispatch(setCurrConv(data.conversations[0]))
            }
            dispatch(retrieveConversations(data.conversations))
            // setConversations([...conversations, ...data.conversations])
        } catch (err) {
            console.error(err.message)
            setErr('Something went wrong')
        }
    }

    if (conversations.length === 0) {
        return <Loading />
    } else if (err) {
        return <div>{err}</div>
    }

    console.log('conversations: ', conversations)

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