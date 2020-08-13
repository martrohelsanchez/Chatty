export function retrieveConversations(retrieveConv) {
    return {
        type: 'conversations/retrievedConversations',
        payload: {
            retrieveConv: [...retrieveConv]
        }
    }
}

export function addConv(conv) {
    return {
        type: 'conversations/addedAConversation',
        payload: {
            conv
        }
    }
}

export function deleteConv(convId) {
    return {
        type: 'conversations/deletedAConversation',
        payload: {
            convId
        }
    }
}

export function patchConv(convId, patch) {
    return {
        type: 'conversations/patchedConversation',
        payload: {
            convId,
            patch
        }
    }
}

export function addPrevMsgs(convId, prevMsgs) {
    return {
        type: 'conversations/addedPreviousMessages',
        payload: {
            prevMsgs,
            convId
        }
    }
}

export function addNewMsg(convId, newMsg) {
    return {
        type: 'conversations/addedANewMessage',
        payload: {
            newMsg: newMsg,
            convId
        }
    }
}

export function updateLastSeen(seenMeta, convId) {
    return {
        type: 'conversation/updatedLastSeen', 
        payload: {
            seenMeta,
            convId
        }
    }
}

export function updateDelivered(deliveredMeta, convId) {
    return {
        type: 'conversations/updatedDelivered',
        payload: {
            deliveredMeta,
            convId
        }
    }
}

export function msgSent(msgId, convId, newDateSent, newMsgId) {
    return {
        type: 'conversations/msgWasSent',
        payload: {
            msgId,
            convId,
            newDateSent,
            newMsgId
        }
    }
}