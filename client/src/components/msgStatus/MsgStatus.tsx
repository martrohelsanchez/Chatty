import React from 'react';
import {useSelector} from 'react-redux';
import {useRouteMatch} from 'react-router-dom';

import styles from './msgStatus.module.css';

import delivered from '../../images/delivered.svg';
import sending from '../../images/sending.svg';
import sent from '../../images/sent.svg';
import seen from '../../images/seen.svg'; 

import {rootState} from '../../redux/store';
import {Message, MembersMeta, PopulatedConversation} from '../../shared/types/dbSchema';
import {UserInfo} from 'redux/actions/userInfoActions';

interface MsgStatusProps {
    allMsg: Message[];
    msgIndex: number;
    membersMeta: PopulatedConversation['members_meta'];
    currMsg: PopulatedConversation['messages'][0];
}

const MsgStatus = ({allMsg, msgIndex, membersMeta, currMsg}: MsgStatusProps) => {
    const user = useSelector((state: rootState) => state.userInfo as UserInfo);
    const match = useRouteMatch<{convId: string}>();
    const nextMsg = allMsg[msgIndex + 1] || {};
    const isLastMsg = allMsg.length - 1 === msgIndex;

    //Know how many members that this is the last message they last saw
    let usersLastMsgSeen = membersMeta.filter(member => {
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
            <div>
                {usersLastMsgSeen.map(user => 
                    <img key={user.user_id} className={styles.status} src={seen} />
                )}
            </div>
        )
    }

    /* if our message hasn't yet seen by anyone, show if the
    message is sending, has sent, or has delivered. */
    if (user.userId === currMsg.sender && isLastMsg) {
        const isSent = currMsg.isSent === undefined ? true : currMsg.isSent;
        const isDelivered = currMsg.is_delivered;

        if (!isSent) {
            return (
                <div>
                    <img className={styles.status} src={sending} />
                </div>
            )
        } else if (isSent && !isDelivered) {
            return (
                <div>
                    <img className={styles.status} src={sent} />
                </div>
            )
        } else if (isDelivered) {
            return (
                <div>
                    <img className={styles.status} src={delivered} />
                </div>
            )
        }
    }

    return null;
}

export default MsgStatus;