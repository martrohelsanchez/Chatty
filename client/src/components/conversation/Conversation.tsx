import React, {useRef} from 'react';
import {useHistory, useRouteMatch} from 'react-router-dom';

import {LastSeen, MergedConversation, Message} from 'shared/types/dbSchema';
import {knowIfHasRead, getConversationName, getConvPic} from 'shared/utils/helpers';
import * as S from './Conversation.styles';

import {rootState} from 'redux/store';
import {useSelector} from 'react-redux';
import {UserInfo} from 'redux/actions/userInfoActions';

interface ConversationProps {
    conv: MergedConversation;
    userLastSeenDoc: LastSeen | null;
}

const Conversation = ({conv, userLastSeenDoc}: ConversationProps) => {               
    const user = useSelector((state: rootState ) => state.userInfo as UserInfo)
    const history = useHistory();
    const match = useRouteMatch<{convId: string}>('/chat/:convId');
    const currConvId = match ? match.params.convId : '';
    const {last_message, is_group_chat} = conv;
    const conversationName = getConversationName(conv, user);
    const isRead = knowIfHasRead(userLastSeenDoc, conv, user.userId);
    const isSelected = currConvId === conv._id ? true : false;
    const convContRef = useRef<HTMLDivElement | null>(null);
    const lastMsgbodyRef = useRef<HTMLSpanElement | null>(null);
    const convPic = getConvPic(conv, user);

    function handleOpenConvo() {
        history.push(`/chat/${conv._id}`);
    }

    return (
        <S.Conversation 
            ref={convContRef}
            isRead={isRead} 
            isSelected={isSelected} 
            onClick={handleOpenConvo}
        >
            <S.ProfilePicHolder pic={convPic}></S.ProfilePicHolder>
            <S.PrevCont>
                <S.ConvName>
                    {conversationName}
                </S.ConvName>
                <S.LastConvoPrev>
                    <span>
                        {renderSender(last_message, user, is_group_chat)}
                    </span>
                    <S.LastMsgBody ref={lastMsgbodyRef}>
                        {last_message.message_body}
                    </S.LastMsgBody>
                </S.LastConvoPrev>
            </S.PrevCont>
        </S.Conversation>
    ) 
}

const renderSender = (
    lastMsg: Message,
    currentUser: UserInfo,
    isGroupChat: boolean
) => {
    if (isGroupChat) {
        if (lastMsg.sender === currentUser.userId) {
            return '';
        } else {
            return lastMsg.sender_username + ': '
        }
    } else {
        if (lastMsg.sender === currentUser.userId) {
            return 'You: ';
        } else {
            return '';
        }
    }
}

export default Conversation