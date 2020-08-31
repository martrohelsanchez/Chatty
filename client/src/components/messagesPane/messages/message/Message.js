import React, { useContext } from 'react'
import styled from 'styled-components';

import {UserInfoContext} from '../../../../App';
import MsgStatus from '../../../msgStatus/MsgStatus';

function Message({message, msgIndex, allMsg, membersMeta}) {
    const {message_body, sender} = message;
    const userInfo = useContext(UserInfoContext);
    const isFromUser = sender._id === userInfo.userId;

    return (
        <>
            <StyledMessage isFromUser={isFromUser}>
                {isFromUser ? (
                    null
                ) : (
                    <span>
                        {sender.username}:{" "}
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
            <MsgStatus allMsg={allMsg} msgIndex={msgIndex} currMsg={message} membersMeta={membersMeta} />
        </>
    )
}

const MsgBox = styled.span`
    display: inline-block;
    background-color: ${({theme, isFromUser}) => isFromUser ? theme.dark.thirdly : theme.dark.primary};
    border-radius: 20px;
    padding: .3em;
    /* width: 200px; */
    color: ${({theme, isFromUser}) => isFromUser ? theme.text.secondary : theme.primary};
`;

const StyledMessage = styled.div`
    align-self: ${({isFromUser}) => isFromUser ? 'flex-end' : 'flex-start'};
`;

export default Message;