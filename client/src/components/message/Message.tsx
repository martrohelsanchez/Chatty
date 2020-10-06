import React from 'react'

import MsgStatus from 'components/msgStatus/MsgStatus';
import {Message as MessageType, PopulatedConversation} from 'shared/types/dbSchema';
import * as S from './Message.style';

import {useSelector} from 'react-redux';
import {rootState} from 'redux/store';
import {UserInfo} from 'redux/actions/userInfoActions';

interface MessageProps {
    message: PopulatedConversation['messages'][0];
    msgIndex: number;
    currConv: PopulatedConversation;
}

const Message = ({message, msgIndex, currConv}: MessageProps) => {
    const userInfo = useSelector((state: rootState) => state.userInfo as UserInfo);
    const {members, messages} = currConv;
    const {message_body, sender} = message;
    const isFromUser = sender === userInfo.userId;
    const startOfMultipleMsgs = messages[msgIndex - 1]?.sender !== messages[msgIndex].sender
    const endOfMultipleMsgs = messages[msgIndex + 1]?.sender !== messages[msgIndex].sender;

    return (
        <>
            <S.StyledMessage isFromUser={isFromUser}>
                {!isFromUser ? (
                    startOfMultipleMsgs && endOfMultipleMsgs ? (
                        <>
                            <S.SenderUsername>
                                {message.sender_username}
                            </S.SenderUsername>
                            <S.UserProfilePic src={members.find(member => member._id === sender)?.profile_pic} />
                        </>
                    ) : startOfMultipleMsgs ? (
                        <S.SenderUsername>
                            {message.sender_username}
                        </S.SenderUsername>
                    ) : endOfMultipleMsgs ? (
                        <S.UserProfilePic src={members.find(member => member._id === sender)?.profile_pic} />
                    ) : (
                        null
                    )
                ) : (
                    null
                )}
                <S.MsgBox  
                    isFromUser={isFromUser}
                    startOfMultipMsgs={startOfMultipleMsgs}
                    endOfMultipMsgs={endOfMultipleMsgs}
                >
                    {message_body}
                </S.MsgBox>
            </S.StyledMessage>
            <MsgStatus 
                msgIndex={msgIndex} 
                currMsg={message} 
                isFromUser={isFromUser}
                currConv={currConv}
            />
        </>
    )
}
export default Message;