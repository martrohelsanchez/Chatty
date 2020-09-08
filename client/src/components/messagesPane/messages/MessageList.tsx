import React, {useState, useEffect, useRef, useContext} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import styles from './messages.module.css';
import MessageComp from './message/Message';
import Loading from '../../loading/Loading';
import ScrollRetract from '../../scrollRetract/ScrollRetract';
import UserIsTyping from '../../userIsTyping/UserIsTyping';
import {seenConvReq} from '../../../api/APIUtils';

import {rootState} from '../../../redux/store';

import {useDispatch} from 'react-redux';
import {addPrevMsgs, updateLastSeen} from '../../../redux/actions/conversationsActions';
import { Message as MessageType } from '../../../shared/types/dbSchema';
import { ConvWithMsgs } from '../../../redux/reducers/conversations';
import {ConvDecoy} from "../../../shared/types/dbSchema";

interface MessageListProps {
    currConv: rootState['conversations'][0]
}

const MessageList = ({currConv}: MessageListProps) => {
    const [err, setErr] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const moreMsgAtDb = useRef(true);
    const [isTyping, setIsTyping] = useState(false);
    const messages = 'messages' in currConv ? currConv.messages : undefined;
    const {convHasCreated} = currConv;
    const currConvId = currConv._id;
    const msgLength = messages ? messages.length : 0;

    useEffect(() => {
        if (messages !== undefined && convHasCreated) {
            //Update the last_seen field in DB when user visits a conversation
            seenConvReq(currConvId, data => {
                const {convId, new_seen, userId} = data.updated_seen;
                //Update the last_seen field in redux
                dispatch(updateLastSeen(convId, userId, new_seen));
            }, err => {
                console.log(err);
                setErr('Sorry, something went wrong');
            });
        }
    }, [msgLength]);

    useEffect(()=> {
        if (messages === undefined && convHasCreated !== false) {
            //get the initial messages if there's no messages yet in current conversation
            getMessages(10, null);
        }

        return () => {
            setErr(null);
            moreMsgAtDb.current = true;
        }
    }, [currConvId]);

    const getMessages = async (limit: number, before: number | null) => {
        setIsLoading(true);
        try {
            const {data} = await axios.get<{messages: MessageType[]}>(`/chat/conversations/${currConvId}/messages`, {
                params: {
                    before: before,
                    limit: limit
                }
            });

            //Newest messages are at the end of the array
            data.messages.reverse();
            
            if (data.messages.length < limit) {
                moreMsgAtDb.current = false;
            }

            ReactDOM.unstable_batchedUpdates(() => {
                setIsLoading(false);
                dispatch(addPrevMsgs(currConvId, data.messages));
            });
        } catch (err) {
            console.error(err);
            setErr('Sorry, something went wrong')
        }
    }

    const handleScroll = (pos) => {
        //when the user scroll to the top to get the previous msgs
        if (pos.scrollTop < 50 && !isLoading && moreMsgAtDb.current && messages !== undefined) {
            getMessages(10, messages[0].date_sent);
        }
    }

    let renderMessages: JSX.Element[] = null!;

    if (messages) {
        renderMessages = messages.map((message, i, msgArr) => {
            return (
                <MessageComp 
                    key={message._id} 
                    message={message} 
                    allMsg={msgArr} 
                    msgIndex={i} 
                    currConv={currConv as ConvWithMsgs | ConvDecoy}
                />
            )
        });
    }

    if (err) {
        return <div>{err}</div>
    }

    return (
        <ScrollRetract 
            className={`${styles.messagesContainer}`}
            whenChanged ={[messages, isTyping]}
            onScroll={handleScroll}
        >
            {isLoading && <Loading />}
            {renderMessages}
            <UserIsTyping setIsTyping={setIsTyping} isTyping={isTyping} />
        </ScrollRetract>
    )
}


export default MessageList;