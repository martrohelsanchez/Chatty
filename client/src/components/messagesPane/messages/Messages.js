import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';

import styles from './messages.module.css';
import Message from './message/Message';
import Loading from '../../loading/Loading';
import { socket } from '../../../App';

import {useDispatch, useSelector} from 'react-redux';
import {setInitialMsg, addNewMsg, addPrevMsgs} from '../../../redux/actions/messagesActions';

let currConv;

function Messages() {
    currConv = useSelector(state => state.currConv);
    const [err, setErr] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const {messages} = useSelector(state => state.messages.find(conv => conv.convId === state.currConv._id)) || {messages: []};
    const dispatch = useDispatch();
    const messagesContainerRef = useRef({});
    const pxFromBottomRef = useRef(null);
    const [pendingAxios, setPendingAxios] = useState(false);

    useEffect(() => {
        socket.on('sendMsg', newMsg => {
            const currConvId = currConv._id;

            //dispatch if the newMsg is for the current conversation
            if (currConvId === newMsg.conversation_id) {
                pxFromBottomRef.current = getPxFromBottom(messagesContainerRef.current); //get the pixels from the bottom before the state updates
                dispatch(addNewMsg(currConvId, newMsg));
            }
        });
    }, [])

    useEffect(()=> {
        if (currConv && messages.length === 0) {
            //get the initial messages if there's no messages yet in current conversation
            getMessages(10, null, true);
        }
    }, [currConv]);

    useEffect(() => {
        const pxFromBottom = pxFromBottomRef.current;

        if (pxFromBottom < 100) {
            scrollToBottom(messagesContainerRef.current);
        }
    }, [messages]);

    if (err) {
        return <div>{err}</div>
    }

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

            if (isInitial) {
                pxFromBottomRef.current = getPxFromBottom(messagesContainerRef.current);

                setIsLoading(false);
                dispatch(setInitialMsg(currConvId, data.messages));
            } else {
                pxFromBottomRef.current = getPxFromBottom(messagesContainerRef.current);
                // setPendingAxios(false);
                setIsLoading(false);
                console.log(data.messages)

                dispatch(addPrevMsgs(currConvId, data.messages));
            }
        } catch (err) {
            console.error(err);
        }
    }

    function handleScrolling(e) {
        if (e.scrollTop < 50 && !pendingAxios) {
            console.log('getting more messages')
            setPendingAxios(true);
            getMessages(10, messages[0].date_sent, false)
            setIsLoading(true);
        }
    }

    function getPxFromBottom(e) {
        return e.scrollHeight - (e.scrollTop + e.clientHeight);
    }
    
    function scrollToBottom(e) {
        if (e) {
            e.scrollTop = e.scrollHeight;
        }
    }

    console.log(messages)

    const renderMessages = messages.map(message => {
        return <Message key={message._id} message={message}/>
    })

    return (
        <div 
            className={`${styles.messagesContainer}`} 
            ref={messagesContainerRef}
            onScroll={() => handleScrolling(messagesContainerRef.current)}
        >
                {isLoading && <Loading />}
                {renderMessages}
        </div>
    )
}

export default Messages;