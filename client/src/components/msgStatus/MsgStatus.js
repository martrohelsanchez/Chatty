import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';

import { UserInfoContext } from '../../App';
import styles from './msgStatus.module.css';

import delivered from '../../images/delivered.svg';
import sending from '../../images/sending.svg';
import sent from '../../images/sent.svg';
import seen from '../../images/seen.svg';

function MsgStatus({allMsg, msgIndex, membersMeta, currMsg, isDelivered}) {
    const user = useContext(UserInfoContext);
    const match = useRouteMatch();
    const lastMessage = useSelector(state => state.conversations.find(conv => conv._id === match.params.convId));
    
    if (allMsg === undefined || membersMeta === undefined) return null;
    
    const nextMsg = allMsg[Number(msgIndex) + 1] || {};
    const isLastMsg = allMsg.length - 1 === msgIndex;
    let lastSeenMembers = [];
    
    //know how many users has seen the message.
    for (let member of membersMeta) {
        const notFromUser = user.userId !== currMsg.sender._id;
        const afterCurrMsg = member.last_seen >= currMsg.date_sent;
        const beforeNextMsg = member.last_seen < nextMsg.date_sent;
        const userLastSeenMsg = isLastMsg ? afterCurrMsg : afterCurrMsg && beforeNextMsg;

        if (userLastSeenMsg && notFromUser) {
            lastSeenMembers.push(member.user_id);
        }
    }

    let seenHeads = [];
    
    //show how many users has seen the message.
    if (lastSeenMembers.length > 0) {
        seenHeads = lastSeenMembers.map(member => {
            return (
                <img key={member} className={styles.status} src={seen} />
            )
        })
        return (
            <div>
                {seenHeads}
            </div>
        )
    }

    /* if our message hasn't read by anyone, show if the
    message is sending, has sent, or has delivered. */
    if (user.userId === currMsg.sender._id && isLastMsg) {
        const isSent = currMsg.is_sent === undefined ? true : currMsg.is_sent;
        const isDelivered = lastMessage.is_delivered;

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