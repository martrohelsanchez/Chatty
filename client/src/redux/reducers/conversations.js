export default function (state = [], action) {
    const {payload, type} = action;
    const stateCopy = [...state.slice(0)];

    switch (type) {
        case 'conversations/retrievedConversations':
            return [...state, ...payload.retrieveConv]    
        case 'conversations/addedPreviousMessages':
            return state.map(conv => {
                if (conv._id === payload.convId) {
                    return {
                        ...conv, 
                        messages: conv.messages ? [...payload.prevMsgs, ...conv.messages] : [...payload.prevMsgs]}
                }
                return conv
            })
        case 'conversations/addedANewMessage':
            for (let i in state) {
                if (state[i]._id === payload.convId) {
                    //copy the target conversation and put it on the first index
                    const newState = [
                        {
                            ...state[i],
                            last_message: {
                                message_body: payload.newMsg.message_body,
                                sender_username: payload.newMsg.sender.username,
                                date_sent: payload.newMsg.date_sent
                            },
                            messages: [...state[i].messages, payload.newMsg]
                        },
                        ...state
                    ];

                    //delete the original targeted conv, so that the new created conv obj replaces it
                    delete newState[Number(i) + 1];

                    return newState;
                }
            }
        case 'conversation/updatedLastSeen':
            return state.map(conv => {
                if (conv._id === payload.convId) {
                    const newMembersMeta = conv.members_meta.map(user => {
                        for (let seenMeta of payload.seenMeta) {
                            if (user.user_id === seenMeta.user_id) {
                                return {
                                    ...user,
                                    last_seen: seenMeta.last_seen
                                }
                            }
                        }
                        return user;
                    });

                    return {
                        ...conv,
                        members_meta: newMembersMeta
                    }
                }
                return conv;
            })
        case 'conversations/updatedDelivered':
            return state.map(conv => {
                if (conv._id === payload.convId) {
                    const newMembersMeta = conv.members_meta.map(user => {
                        for (let deliveredMeta of payload.deliveredMeta) {
                            if (user.user_id === deliveredMeta.user_id) {
                                return {
                                    ...user,
                                    delivered: deliveredMeta.delivered
                                }
                            }
                        }

                        return user;
                    })

                    return {
                        ...conv,
                        members_meta: newMembersMeta
                    }
                }
                return conv;
            })
        default:
            return state;
    }
}