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
    isDelivered: boolean;
}

const MsgStatus = ({allMsg, msgIndex, membersMeta, currMsg, isDelivered}: MsgStatusProps) => {
    const user = useSelector((state: rootState) => state.userInfo as UserInfo);
    const match = useRouteMatch<{convId: string}>();
    const nextMsg = allMsg[msgIndex + 1] || {};
    const isLastMsg = allMsg.length - 1 === msgIndex;
    let lastSeenMembers: string[] = [];
    
    //Know how many users is the last seen of the message
    for (let member of membersMeta) {
        if (user.userId === member.user_id) {
            continue
        }

        const seenCurrMsg = member.last_seen >= currMsg.date_sent;
        const seenNextMsg = member.last_seen > nextMsg.date_sent;
        const userLastSeenMsg = isLastMsg ? seenCurrMsg : seenCurrMsg && !seenNextMsg;

        if (userLastSeenMsg) {
            lastSeenMembers.push(member.user_id);
        }
    }

    let seenHeads = [];

    //show users who are the last seen of the message
    if (lastSeenMembers.length > 0) {
        return (
            <div>
                {lastSeenMembers.map(user => 
                    <img key={user} className={styles.status} src={seen} />
                )}
            </div>
        )
    }

    /* if our message hasn't yet seen by anyone, show if the
    message is sending, has sent, or has delivered. */
    if (user.userId === currMsg.sender && isLastMsg) {
        const isSent = currMsg.isSent === undefined ? true : currMsg.isSent;

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