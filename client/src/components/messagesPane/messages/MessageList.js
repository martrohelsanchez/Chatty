import React, {useState, useEffect, useRef, useContext} from 'react';
import axios from 'axios';

import styles from './messages.module.css';
import Message from './message/Message';
import Loading from '../../loading/Loading';
import ScrollMessages from '../../scrollMessage/ScrollMessages';
import { socket, UserInfoContext } from '../../../App';

import {useDispatch, useSelector} from 'react-redux';
import {addPrevMsgs, updateLastSeen} from '../../../redux/actions/conversationsActions';
import MsgStatus from '../../msgStatus/MsgStatus';

import UserIsTyping from '../../userIsTyping/UserIsTyping';

function MessageList({isDelivered, currConv}) {
    const currConvId = currConv ? currConv._id : '';
    const messages = currConv ? currConv.messages || [] : [];
    const membersMeta = currConv ? currConv.members_meta : [];
    const members = currConv ? currConv.members : [];
    const user = useContext(UserInfoContext);
    const [err, setErr] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const moreMsgAtDb = useRef(true);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        // const userMeta = membersMeta.find(userMeta => userMeta.user_id === user.userId);
        // const lastMessage = messages[messages.length - 1];

        // if (userMeta.last_seen < lastMessage.date_sent) {
        //     seenMsg(members._id);
        // }
    }, [messages]);

    async function seenMsg(convMembers) {
        try {
            const res = await axios.patch(`/chat/conversations/${currConvId}/seen`, {
                params: {
                    convMembers: convMembers
                }
            });

            //redux
        } catch (err) {
            console.error(err);
            setErr('Sorry, something went wrong');
        }
    }

    useEffect(()=> {
        if (currConvId && messages.length === 0 && currConv.convHasCreated !== false) {
            //get the initial messages if there's no messages yet in current conversation
            getMessages(10, null, true);
        }

        return () => {
            setErr(false);
            moreMsgAtDb.current = true;
        }
    }, [currConvId]);

    async function getMessages(limit, before, isInitial) {
        setIsLoading(true);
        try {
            const {data} = await axios.get(`/chat/conversations/${currConvId}/messages`, {
                params: {
                    before: before,
                    limit: limit
                }
            });

            data.messages.reverse();
            
            if (data.messages.length < 10) {
                moreMsgAtDb.current = false;
            }

            if (isInitial) {
                setIsLoading(false);
                dispatch(addPrevMsgs(currConvId, data.messages));
            } else {
                setIsLoading(false);
                dispatch(addPrevMsgs(currConvId, data.messages));
            }
        } catch (err) {
            console.error(err);
            setErr('Sorry, something went wrong')
        }
    }

    function handleScroll(pos) {
        //when the user scroll to the top to get the previous msgs
        if (pos.scrollTop < 50 && !isLoading && moreMsgAtDb.current && messages.length !== 0) {
            getMessages(10, messages[0].date_sent, false);
        }
    }

    const renderMessages = messages.map((message, i, msgArr) => {
        return (
            <div key={message._id}>
                <Message message={message}/>
                <MsgStatus allMsg={msgArr} msgIndex={i} currMsg={message} membersMeta={membersMeta} isDelivered={isDelivered}/>
            </div>
        )
    });

    if (err) {
        return <div>{err}</div>
    }

    return (
        <ScrollMessages 
            className={`${styles.messagesContainer}`}
            whenChanged ={[messages, isTyping]}
            messages={messages}
            onScroll={handleScroll}
        >
            {isLoading && <Loading />}
            {renderMessages}
            <UserIsTyping setIsTyping={setIsTyping} isTyping={isTyping} />
        </ScrollMessages>
    )
}

export default MessageList;