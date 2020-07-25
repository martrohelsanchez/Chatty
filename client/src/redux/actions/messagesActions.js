export function setInitialMsg(convId, msgs) {
    return {
        type: 'messages/setInitialMessages',
        payload: {
            initialMsgs: msgs,
            convId
        }
    }
}

export function addNewMsg(convId, newMsg) {
    return {
        type: 'messages/addedNewMessage',
        payload: {
            newMsg: newMsg,
            convId
        }
    }
}

export function addPrevMsgs(convId, prevMsgs) {
    return {
        type: 'messages/addedPreviousMessages',
        payload: {
            prevMsgs: prevMsgs,
            convId
        }
    }
}