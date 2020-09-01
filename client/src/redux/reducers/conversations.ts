export default function (state = [], action) {
    const {payload, type} = action;

    switch (type) {
        case 'conversations/retrievedConversations':
            return [...state, ...payload.retrieveConv]    
        case 'conversations/addedAConversation':
            return [payload.conv, ...state]
        case 'conversations/deletedAConversation': {
            const newConversations = [];

            for (let conv of state) {
                if (conv._id !== payload.convId) {
                    newConversations.push(conv);
                }
            }

            return newConversations;
        }
        case 'conversations/patchedConversation':
            return state.map(conv => {
                if (conv._id === payload.convId) {
                    return {
                        ...conv,
                        ...payload.patch
                    }
                }
                return conv;
            })
        case 'conversations/addedPreviousMessages':
            return state.map(conv => {
                if (conv._id === payload.convId) {
                    return {
                        ...conv, 
                        messages: conv.messages ? [...payload.prevMsgs, ...conv.messages] : [...payload.prevMsgs]}
                }
                return conv
            })
        case 'conversations/addedANewMessage': {
            const newConversations = [];

            for (let conv of state) {
                if (conv._id === payload.convId) {
                    const newConv = {
                        ...conv, 
                        last_message: {
                            message_body: payload.newMsg.message_body,
                            sender_username: payload.newMsg.sender.username,
                            date_sent: payload.newMsg.date_sent
                        },
                        messages: [...(conv.messages || []), payload.newMsg]
                    }

                    newConversations.unshift(newConv);
                } else {
                    newConversations.push(conv);
                }
            }

            return newConversations;
        }
        case 'conversation/updatedMembersMeta':
            return state.map(conv => {
                if (conv._id === payload.convId) {
                    return {
                        ...conv,
                        members_meta: payload.newMembersMeta
                    }
                }

                return conv;
            })
        case 'conversation/updatedLastSeen':
            return state.map(conv => {
                if (conv._id === payload.convId) {
                    const newMembersMeta = conv.members_meta.map(memberMeta => {
                        if (memberMeta.user_id === payload.userId) {
                            return {
                                ...memberMeta,
                                last_seen: payload.newSeen
                            }
                        }

                        return memberMeta;
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
        case 'conversations/msgWasSent':
            return state.map(conv => {
                if (conv._id === payload.convId) {
                    const newMessages = conv.messages.map(msg => {
                        if (msg._id === payload.msgId) {
                            return {
                                ...msg,
                                is_sent: true,
                                date_sent: payload.dateSent
                            }
                        }
                        return msg;
                    })

                    return {
                        ...conv,
                        messages: newMessages,
                        date_sent: payload.newDateSent
                    }
                }
                return conv;
            });
        default:
            return state;
    }
}