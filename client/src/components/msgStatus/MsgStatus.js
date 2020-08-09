import React, { useContext } from 'react';

import { UserInfoContext } from '../../App';
import styles from './msgStatus.module.css';

import delivered from '../../images/delivered.svg';
import sending from '../../images/sending.svg';
import sent from '../../images/sent.svg';
import seen from '../../images/seen.svg';

function MsgStatus({allMsg, msgIndex, membersMeta, currMsg, isDelivered}) {
    const user = useContext(UserInfoContext);
    
    if (allMsg === undefined) return null;
    
    const nextMsg = allMsg[Number(msgIndex) + 1] || {};
    const isLastMsg = allMsg.length - 1 === msgIndex;
    let lastSeenMembers = [];
    
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

    if (user.userId === currMsg.sender._id && isLastMsg) {
        const isSent = currMsg.is_sent === undefined ? true : currMsg.is_sent;

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