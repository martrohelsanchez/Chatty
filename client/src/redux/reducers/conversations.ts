import {ConversationActionTypes} from '../actions/conversationsActions';
import {ConversationPopulateMembers, Message, Conversation, MessagePopulateSender} from '../../shared/types/dbSchema';

interface ConversationState extends ConversationPopulateMembers{
    messages: MessagePopulateSender[];
}

export default (state: ConversationState[] = [], action: ConversationActionTypes): ConversationState[] | ConversationPopulateMembers[] => {
    switch (action.type) {
        case 'conversations/retrievedConversations':
            return [...state, ...action.retrieveConv]    
        case 'conversations/addedAConversation':
            return [action.conv, ...state]
        case 'conversations/deletedAConversation': {
            const newConversations: typeof state = [];

            for (let conv of state) {
                if (conv._id !== action.convId) {
                    newConversations.push(conv);
                }
            }

            return newConversations;
        }
        case 'conversations/patchedConversation':
            // action.patch
            return state.map(conv => {
                if (conv._id === action.convId) {
                    return {
                        ...conv,
                        ...action.patch
                    }
                }
                return conv;
            })
            // return state.map(conv => {
            //     if (conv._id === action.convId) {
            //         return {
            //             ...conv,
            //             ...action.patch
            //         }
            //     }
            //     return conv;
            // })
        case 'conversations/addedPreviousMessages':
            return state.map(conv => {
                if (conv._id === action.convId) {
                    return {
                        ...conv, 
                        messages: conv.messages ? [...action.prevMsgs, ...conv.messages] : [...action.prevMsgs]}
                }
                return conv
            })
        case 'conversations/addedANewMessage': {
            const newConversations: ConversationState[] = [];

            for (let conv of state) {
                if (conv._id === action.convId) {
                    const newConv: ConversationState = {
                        ...conv, 
                        last_message: {
                            message_body: action.newMsg.message_body,
                            sender_username: action.newMsg.sender.username,
                            date_sent: action.newMsg.date_sent,
                            sender_id: 'sadfas',
                            is_delivered: true
                        },
                        messages: [...(conv.messages || []), action.newMsg]
                    }

                    //Puts the conversation to the top when a new message is received
                    newConversations.unshift(newConv);
                } else {
                    newConversations.push(conv);
                }
            }

            return newConversations;
        }
        case 'conversation/updatedMembersMeta':
            return state.map(conv => {
                if (conv._id === action.convId) {
                    return {
                        ...conv,
                        members_meta: action.newMembersMeta
                    }
                }

                return conv;
            })
        case 'conversation/updatedLastSeen':
            return state.map(conv => {
                if (conv._id === action.convId) {
                    const newMembersMeta = conv.members_meta.map(memberMeta => {
                        if (memberMeta.user_id === action.userId) {
                            return {
                                ...memberMeta,
                                last_seen: action.newSeen
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
        // case 'conversations/updatedDelivered':
        //     return state.map(conv => {
        //         if (conv._id === payload.convId) {
        //             const newMembersMeta = conv.members_meta.map(user => {
        //                 for (let deliveredMeta of payload.deliveredMeta) {
        //                     if (user.user_id === deliveredMeta.user_id) {
        //                         return {
        //                             ...user,
        //                             delivered: deliveredMeta.delivered
        //                         }
        //                     }
        //                 }

        //                 return user;
        //             })

        //             return {
        //                 ...conv,
        //                 members_meta: newMembersMeta
        //             }
        //         }
        //         return conv;
        //     })
        case 'conversations/msgHasSent':
            return state.map(conv => {
                if (conv._id === action.convId) {
                    const newMessages = conv.messages.map(msg => {
                        if (msg._id === action.msgId) {
                            return {
                                ...msg,
                                _id: action.newMsgId,
                                is_sent: true,
                                date_sent: action.newDateSent
                            }
                        }
                        return msg;
                    })

                    return {
                        ...conv,
                        messages: newMessages,
                    }
                }
                return conv;
            });
        default:
            return state;
    }
}