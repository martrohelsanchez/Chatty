import React, {useState, useEffect, useRef, useContext} from 'react';
import axios from 'axios';
import { useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';

import styles from './messages.module.css';
import Message from './message/Message';
import Loading from '../../loading/Loading';
import ScrollMessages from '../../scrollMessage/ScrollMessages';
import { socket, UserInfoContext } from '../../../App';
import UserIsTyping from '../../userIsTyping/UserIsTyping';
import MsgStatus from '../../msgStatus/MsgStatus';
import {seenConvReq} from '../../../api/APIUtils';

import {useDispatch, useSelector} from 'react-redux';
import {addPrevMsgs, updateMembersMeta} from '../../../redux/actions/conversationsActions';


function MessageList({isDelivered}) {
    const match = useRouteMatch();
    const user = useContext(UserInfoContext);
    const [err, setErr] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const moreMsgAtDb = useRef(true);
    const [isTyping, setIsTyping] = useState(false);
    const {
        currConvId,
        messages,
        membersMeta,
        members,
        convHasCreated,
        lastMessage
    } = useSelector(state => {
        const conv = state.conversations.find(conv => conv._id === match.params.convId) || {};
        return {
            currConvId: conv._id,
            messages: conv.messages,
            membersMeta: conv.members_meta,
            members: conv.members,
            convHasCreated: conv.convHasCreated,
            lastMessage: conv.last_message
        }
    });
    const msgLength = messages ? messages.length : 0;

    useEffect(() => {
        //Sends a req to server when user visits a conversation to update the last_seen field
        if (messages !== undefined) {
            seenConvReq(currConvId, members, data => {
                dispatch(updateMembersMeta(data.members_meta, currConvId));
            }, err => {
                console.log(err);
                setErr('Sorry, something went wrong');
            });
        }
    }, [msgLength]);

    useEffect(()=> {
        if (currConvId && messages === undefined && convHasCreated !== false) {
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
        if (pos.scrollTop < 50 && !isLoading && moreMsgAtDb.current && messages !== undefined) {
            getMessages(10, messages[0].date_sent, false);
        }
    }

    if (messages) {
        var renderMessagesWithStatus = messages.map((message, i, msgArr) => {
            return (
                <div key={message._id}>
                    <Message message={message} allMsg={msgArr} msgIndex={i} membersMeta={membersMeta} />
                    {/* <MsgStatus allMsg={msgArr} msgIndex={i} currMsg={message} membersMeta={membersMeta} isDelivered={isDelivered}/> */}
                </div>
            )
        });
    }

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
            {renderMessagesWithStatus}
            <UserIsTyping setIsTyping={setIsTyping} isTyping={isTyping} />
        </ScrollMessages>
    )
}

export default MessageList;