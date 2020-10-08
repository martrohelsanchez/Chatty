import React from 'react';
import {useSelector} from 'react-redux';
import {useRouteMatch} from 'react-router-dom';

import * as S from './MsgStatus.styles';
import delivered from 'images/delivered.svg';
import sending from 'images/sending.svg';
import sent from 'images/sent.svg';

import {rootState} from 'redux/store';
import {Message, PopulatedConversation} from 'shared/types/dbSchema';
import {UserInfo} from 'redux/actions/userInfoActions';

interface MsgStatusProps {
    msgIndex: number;
    currMsg: PopulatedConversation['messages'][0];
    isFromUser: boolean;
    currConv: PopulatedConversation;
}

const MsgStatus = ({msgIndex, currMsg, isFromUser, currConv}: MsgStatusProps) => {
    const user = useSelector((state: rootState) => state.userInfo as UserInfo);
    const {members_meta, messages, members} = currConv;
    const nextMsg = messages[msgIndex + 1] || {};
    const isLastMsg = messages.length - 1 === msgIndex;

    //Know how many members that this is the last message they last saw
    let usersLastMsgSeen = members_meta.filter(member => {
        const seenCurrMsg = member.last_seen >= currMsg.date_sent;
        const seenNextMsg = member.last_seen > nextMsg.date_sent;
        const userLastMsgSeen = isLastMsg ? seenCurrMsg : seenCurrMsg && !seenNextMsg;

        if (user.userId === member.user_id) {
            return false;
        }

        if (userLastMsgSeen) {
            return true
        }
    })

    //Render users who are the last seen of the message
    if (usersLastMsgSeen.length > 0) {
        return (
            <S.MsgStatusContainer isFromUser={isFromUser}>
                {usersLastMsgSeen.map(user => 
                    <S.Status key={user.user_id} src={members.find(member => (
                        member._id === user.user_id
                    ))?.profile_pic} />
                )}
            </S.MsgStatusContainer>
        )
    }

    /* if our message hasn't yet seen by anyone, show if the
    message is sending, has sent, or has delivered. */
    if (user.userId === currMsg.sender && isLastMsg) {
        const isSent = currMsg.isSent === undefined ? true : currMsg.isSent;
        const isDelivered = currMsg.is_delivered;

        if (!isSent) {
            return (
                <S.MsgStatusContainer isFromUser={isFromUser}>
                    <S.Status src={sending} />
                </S.MsgStatusContainer>
            )
        } else if (isSent && !isDelivered) {
            return (
                <S.MsgStatusContainer isFromUser={isFromUser}>
                    <S.Status src={sent} />
                </S.MsgStatusContainer>
            )
        } else if (isDelivered) {
            return (
                <S.MsgStatusContainer isFromUser={isFromUser}>
                    <S.Status src={delivered} />
                </S.MsgStatusContainer>
            )
        }
    }

    return null;
}

export default MsgStatus;