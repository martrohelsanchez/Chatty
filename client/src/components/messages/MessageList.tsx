import React, {useState, useEffect, useRef} from 'react';
import ReactDOM from 'react-dom';

import * as S from './MessageList.styles';
import Message from 'components/message/Message';
import UserIsTyping from 'components/userIsTyping/UserIsTyping';
import {seenConvReq, getMembersReq, getMembersMetaReq, getMessagesReq} from 'api/APIUtils';
import {MergedConversation, PopulatedConversation} from 'shared/types/dbSchema';

import {useDispatch} from 'react-redux';
import {addPrevMsgs, updateLastSeen, modifyMembers, modifyMembersMeta} from 'redux/actions/conversationsActions';
import Typing from 'components/typing/Typing';

interface MessageListProps {
    currConv: MergedConversation
}

const MessageList = ({currConv}: MessageListProps) => {
    const [err, setErr] = useState<string | null>(null);
    const [numOfLoading, setNumOfLoading] = useState(0);
    const dispatch = useDispatch();
    const moreMsgAtDb = useRef(true);
    const [isTyping, setIsTyping] = useState(false);
    const messages = 'messages' in currConv ? currConv.messages : undefined;
    const {members, members_meta} = currConv;
    const currConvId = currConv._id;

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currConvId, messages?.length]);

    //When user switches through conversations
    useEffect(()=> {
        setNumOfLoading(c => ++c);
        getMembersMetaReq(currConvId, currConv.members_meta_id, (data) => {
            dispatch(modifyMembersMeta(currConvId, 'set', data.members_meta));
            setNumOfLoading(c => c - 1);
        })

        if (typeof currConv.members[0] === 'string' && typeof currConv.members_meta === 'string') {
            //members and members_meta is not yet populated
            setNumOfLoading(c => ++c);
            getMembersReq(currConvId, currConv.members as string[], (data) => {
                dispatch(modifyMembers(currConvId, 'set', data, ));
                setNumOfLoading(c => c - 1);
            });
        }

        if (messages === undefined) {
            //get the initial messages if there are no messages yet in current conversation
            getMessages(30, null);
        } 
        return () => {
            moreMsgAtDb.current = true;
            // setNumOfLoading(3);
            setErr(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currConvId]);

    const getMessages = async (limit: number, before: number | null) => {
        setNumOfLoading(c => c + 1);
        getMessagesReq(currConvId, limit, before, (data) => {
            //Newest messages must be at the end of the array
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

    const handleScroll = (pos: React.UIEvent<HTMLDivElement, UIEvent>) => {
        //when the user scroll to the top to get the previous msgs
        const isLoading = numOfLoading > 0;
        if (pos.currentTarget.scrollTop === 0 && !isLoading && moreMsgAtDb.current && messages !== undefined) {
            getMessages(30, messages[0].date_sent);
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
        <S.ScrollRetract
            whenChanged={[messages, isTyping]}
            onScroll={handleScroll}
        >
            {numOfLoading > 0 ? (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%'}}>
                    <S.TypingCont>
                        <Typing forMascot={false} />
                    </S.TypingCont>
                </div>
            ) : (
                null
            )}
            {renderMessages}
            <UserIsTyping setIsTyping={setIsTyping} isTyping={isTyping} />
        </S.ScrollRetract>
    )
}

export default MessageList;