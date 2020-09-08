import {ConvDecoy} from '../actions/conversationsActions/types';
import {ConversationActionTypes} from "../actions/conversationsActions";
import { ConversationPopulateMembers, Message, User} from '../../shared/types/dbSchema';

export interface ConvWithoutMsgs extends ConversationPopulateMembers {
    convHasCreated: true;
}

export interface ConvWithMsgs extends ConvWithoutMsgs{
    messages: (Message & {is_sent?: boolean})[];
}

export type ConversationsState = (ConvWithMsgs | ConvWithoutMsgs | ConvDecoy)[];

let initialState: ConversationsState = [];

const conversations = (state = initialState, action: ConversationActionTypes): ConversationsState => {
    switch (action.type) {
        case 'conversations/retrievedConversations': {
            const retrievedConversations = action.retrieveConv.map<ConvWithoutMsgs>(conv => ({
                ...conv,
                convHasCreated: true
            }));

            return [...state, ...retrievedConversations];
        }
        case 'conversations/addedAConversation':
            return [(action.conv as ConvDecoy | ConvWithoutMsgs), ...state];
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
            return (state as ConvWithMsgs[]).map(conv => {
                if (conv._id === action.convId) {
                    return {
                        ...conv,
                        ...action.patch
                    }
                }
                return conv;
            })
        case 'conversations/addedPreviousMessages':
            return state.map(conv => {
                if (conv._id === action.convId) {
                    return {
                        ...conv, 
                        messages: 'messages' in conv  ? [...action.prevMsgs, ...conv.messages] : [...action.prevMsgs]}
                }
                return conv
            })
        case 'conversations/addedANewMessage': {
            const newConversations: typeof state = [];

            for (let conv of state) {
                if (conv._id === action.convId) {
                    const newConv = {
                        ...conv, 
                        last_message: {
                            message_body: action.newMsg.message_body,
                            sender_username: conv.members.find(user => user._id === action.newMsg.sender)?.username as string,
                            date_sent: action.newMsg.date_sent,
                            sender_id: action.newMsg.sender,
                            is_delivered: true
                        },
                        messages: [...('messages' in conv ? conv.messages : []), action.newMsg]
                    }

                    //Puts the conversation to the top when a new message is added
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
                    const newMembersMeta = (conv as ConvWithMsgs).members_meta.map(memberMeta => {
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
                    const newMessages = (conv as ConvWithMsgs).messages.map(msg => {
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

export default conversations;;