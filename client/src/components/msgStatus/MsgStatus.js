import React, { useContext } from 'react';

import { UserInfoContext } from '../../App';

import delivered from '../../images/delivered.svg';
import sending from '../../images/sending.svg';
import set from '../../images/sent.svg';
import seen from '../../images/seen.svg';

function MsgStatus({allMsg, msgIndex, membersMeta, currMsg}) {
    const user = useContext(UserInfoContext);
    const nextMsg = allMsg[Number(msgIndex) + 1];
    let lastSeenMembers = [];
    
    for (let member of membersMeta) {
        if (member.last_seen >= currMsg.date_sent && member.last_seen <= currMsg.date_sent) {
            lastSeenMembers.push(member.user_id)
        }
    }

    let seenHeads;

    if (lastSeenMembers.length > 0) {
        seenHeads = lastSeenMembers.map(member => {
            return (
                <img src={seen} />
            )
        })
    }

    return (
        <div>

        </div>
    )
}

export default MsgStatus;