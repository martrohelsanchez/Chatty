import React, { useContext } from 'react'
import styled from 'styled-components';

import {UserInfoContext} from '../../../../App';
import MsgStatus from '../../../msgStatus/MsgStatus';

import {Message as MessageType, MembersMeta, User} from '../../../../shared/types/dbSchema';
import { ConvWithMsgs } from '../../../../redux/reducers/conversations';
import { ConvDecoy } from '../../../../redux/actions/conversationsActions/types';

interface MessageProps {
    message: MessageType;
    msgIndex: number;
    allMsg: MessageType[];
    currConv: ConvWithMsgs | ConvDecoy;
}

const Message = ({message, msgIndex, allMsg, currConv}: MessageProps) => {
    const {members} = currConv;
    const userInfo = useContext(UserInfoContext);
    const {message_body, sender} = message;
    const isFromUser = sender === userInfo.userId;

    return (
        <>
            <StyledMessage isFromUser={isFromUser}>
                {isFromUser ? (
                    null
                ) : (
                    <span>
                        {members.find(user => user.username)}:{" "}
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
                    allMsg={allMsg} 
                    msgIndex={msgIndex} 
                    currMsg={message} 
                    membersMeta={currConv.members_meta} 
                    isDelivered={currConv.last_message.is_delivered} />
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