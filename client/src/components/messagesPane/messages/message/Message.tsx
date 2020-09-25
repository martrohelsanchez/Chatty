import React from 'react'
import styled from 'styled-components';

import MsgStatus from 'components/msgStatus/MsgStatus';
import {Message as MessageType, PopulatedConversation} from 'shared/types/dbSchema';

import {useSelector} from 'react-redux';
import {rootState} from 'redux/store';
import {UserInfo} from 'redux/actions/userInfoActions';

interface MessageProps {
    message: PopulatedConversation['messages'][0];
    msgIndex: number;
    currConv: PopulatedConversation;
}

const Message = ({message, msgIndex, currConv}: MessageProps) => {
    const {members} = currConv;
    const userInfo = useSelector((state: rootState) => state.userInfo as UserInfo);
    const {message_body, sender} = message;
    const isFromUser = sender === userInfo.userId;

    return (
        <>
            <StyledMessage isFromUser={isFromUser}>
                {isFromUser ? (
                    null
                ) : (
                    <span>
                        {members.find(user => user.username)?.username}:{" "}
                    </span>
                )}
                <MsgBox isFromUser={isFromUser}>
                    {message_body}
                </MsgBox>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
            </StyledMessage>
            {'members_meta' in currConv ? (
                <MsgStatus 
                    allMsg={currConv.messages} 
                    msgIndex={msgIndex} 
                    currMsg={message} 
                    membersMeta={currConv.members_meta} 
                />
            ) : (
                null
            )}
        </>
    )
}

const MsgBox = styled.span<{isFromUser: boolean}>`
    display: inline-block;
    background-color: ${({theme, isFromUser}) => isFromUser ? theme.dark.thirdly : theme.dark.primary};
    border-radius: 20px;
    padding: .3em;
    /* width: 200px; */
    color: ${({theme, isFromUser}) => isFromUser ? theme.text.secondary : theme.text.primary};
`;

const StyledMessage = styled.div<{isFromUser: boolean}>`
    align-self: ${({isFromUser}) => isFromUser ? 'flex-end' : 'flex-start'};
`;

export default Message;