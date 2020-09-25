import React, {useState, useEffect, useRef} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import styles from './messages.module.css';
import Message from './message/Message';
import Loading from 'components/loading/Loading';
import ScrollRetract from 'components/scrollRetract/ScrollRetract';
import UserIsTyping from 'components/userIsTyping/UserIsTyping';
import {seenConvReq, getMembersReq, getMembersMetaReq, getMessagesReq} from 'api/APIUtils';
import { Message as MessageType, MergedConversation, User, PopulatedConversation} from 'shared/types/dbSchema';

import {useDispatch} from 'react-redux';
import {addPrevMsgs, updateLastSeen, modifyMembers, modifyMembersMeta} from 'redux/actions/conversationsActions';

interface MessageListProps {
    currConv: MergedConversation
}

const MessageList = ({currConv}: MessageListProps) => {
    const [err, setErr] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [numOfLoading, setNumOfLoading] = useState(3);
    const dispatch = useDispatch();
    const moreMsgAtDb = useRef(true);
    const [isTyping, setIsTyping] = useState(false);
    const messages = 'messages' in currConv ? currConv.messages : undefined;
    const {members, members_meta} = currConv;
    const currConvId = currConv._id;
    const msgLength = messages ? messages.length : 0;

    useEffect(() => {
        if (messages !== undefined) {
            //Update the last_seen field in DB when user visits a conversation
            seenConvReq(currConvId, data => {
                const {convId, new_seen, userId} = data;
                //Update the last_seen field in redux
                dispatch(updateLastSeen(convId, userId, new_seen));
            }, err => {
                console.error(err);
                setErr('Sorry, something went wrong');
            });
        }
    }, [msgLength]);

    //When user switches through conversations
    useEffect(()=> {
        if (typeof currConv.members[0] === 'string' && typeof currConv.members_meta === 'string') {
            //members and members_meta is not yet populated
            getMembersReq(currConvId, currConv.members as string[], (data) => {
                dispatch(modifyMembers(currConvId, 'set', data, ));
                setNumOfLoading(c => c - 1);
            });
            getMembersMetaReq(currConvId, currConv.members_meta, (data) => {
                dispatch(modifyMembersMeta(currConvId, 'set', data.members_meta));
                setNumOfLoading(c => c - 1);
            })
        }

        if (messages === undefined) {
            //get the initial messages if there are no messages yet in current conversation
            getMessages(10, null, true);
        }

        return () => {
            moreMsgAtDb.current = true;
            setNumOfLoading(3);
            setErr(null);
        }
    }, [currConvId]);

    const getMessages = async (limit: number, before: number | null, initial) => {
        initial ? setNumOfLoading(c => c - 1) : setNumOfLoading(1);

        getMessagesReq(currConvId, limit, before, (data) => {
            //Newest messages are at the end of the array
            data.messages.reverse();

            if (data.messages.length < limit) {
                moreMsgAtDb.current = false;
            }

            ReactDOM.unstable_batchedUpdates(() => {
                dispatch(addPrevMsgs(currConvId, data.messages));
                setNumOfLoading(c => c - 1);
            });
        }, (err) => {
            console.error(err);
            setErr('Sorry, something went wrong')
            setNumOfLoading(0);
        })
    }

    const handleScroll = (pos) => {
        //when the user scroll to the top to get the previous msgs
        if (pos.scrollTop < 50 && !isLoading && moreMsgAtDb.current && messages !== undefined) {
            getMessages(10, messages[0].date_sent, false);
        }
    }

    let renderMessages: JSX.Element[] = null!;

    if (currConv.messages !== undefined && typeof members_meta !== 'string' && typeof members[0] !== 'string') {
        renderMessages = currConv.messages.map((message, i, msgArr) => {
            return (
                <Message 
                    key={message._id} 
                    message={message} 
                    msgIndex={i} 
                    currConv={currConv as PopulatedConversation}
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
            {numOfLoading === 0 ? (
                <>
                    {renderMessages}
                    <UserIsTyping setIsTyping={setIsTyping} isTyping={isTyping} />
                </>
            ) : (
                <Loading />
            )}
        </ScrollRetract>
    )
}

export default MessageList;