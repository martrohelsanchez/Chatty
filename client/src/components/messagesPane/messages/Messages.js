import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';

import styles from './messages.module.css';
import Message from './message/Message';
import Loading from '../../loading/Loading';
import { socket } from '../../../App';

import {useDispatch, useSelector} from 'react-redux';
import {setInitialMsg, addNewMsg, addPrevMsgs} from '../../../redux/actions/messagesActions';
import ScrollMessages from '../../scrollMessage/ScrollMessages';

let currConv;

function Messages() {
    currConv = useSelector(state => state.currConv);
    const [err, setErr] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const {messages} = useSelector(state => state.messages.find(conv => conv.convId === state.currConv._id)) || {messages: []};
    const dispatch = useDispatch();
    const messagesContainerRef = useRef({});
    const moreMsgAtDb = useRef(true);

    useEffect(() => {
        socket.on('sendMsg', newMsg => {
            const currConvId = currConv._id;

            //dispatch if the newMsg is for the current conversation
            if (currConvId === newMsg.conversation_id) {
                dispatch(addNewMsg(currConvId, newMsg));
            }
        });
    }, [])

    useEffect(()=> {
        if (currConv && messages.length === 0) {
            //get the initial messages if there's no messages yet in current conversation
            getMessages(10, null, true);
        }

        return () => {
            moreMsgAtDb.current = true;
        }
    }, [currConv]);

    async function getMessages(limit, before, isInitial) {
        try {
            const currConvId = currConv._id;
            const {data} = await axios.get(`/chat/conversations/${currConvId}/messages`, {
                params: {
                    before: before,
                    limit: limit
                }
            })

            data.messages.reverse();
            
            if (data.messages.length < 10) {
                moreMsgAtDb.current = false;
            }

            if (isInitial) {
                setIsLoading(false);
                dispatch(setInitialMsg(currConvId, data.messages));
            } else {
                setIsLoading(false);
                dispatch(addPrevMsgs(currConvId, data.messages));
            }
        } catch (err) {
            console.error(err);
        }
    }

    function getMoreMsg() {
        getMessages(10, messages[0].date_sent, false);
        setIsLoading(true);
    }

    const renderMessages = messages.map(message => {
        return <Message key={message._id} message={message}/>
    });

    if (err) {
        return <div>{err}</div>
    }

    return (
        <ScrollMessages 
            className={`${styles.messagesContainer}`}
            messages={messages}
            isLoading={isLoading}
            moreAtDb={moreMsgAtDb}
            getMoreMsg={getMoreMsg}
        >
            {isLoading && <Loading />}
            {renderMessages}
        </ScrollMessages>
    )
}

export default Messages;