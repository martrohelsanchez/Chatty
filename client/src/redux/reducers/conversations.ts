import {ConvDecoy, MergedConversation, MembersMeta} from "shared/types/dbSchema";
import {ConversationActionTypes} from "redux/actions/conversationsActions";
import {User} from 'shared/types/dbSchema';

export type ConversationsState = (MergedConversation | ConvDecoy)[];

let initialState: ConversationsState = [];

const conversations = (state = initialState, action: ConversationActionTypes): ConversationsState => {
    switch (action.type) {
        case 'conversations/retrievedConversations': {
            const retrievedConversations = action.retrieveConv.map(conv => ({
                ...conv,
                convHasCreated: true
            }));

            return [...state, ...retrievedConversations] as typeof state;
        }
        case 'conversations/addedAConversation':
            return [action.conv, ...state] as typeof state;
        case 'conversation/updatedLastMsg': {
            const newConversations: typeof state = [];
            for (let conv of state) {
                if (action.convId === conv._id) {
                    const newConv = {
                        ...conv,
                        last_message: action.msg
                    }
                    newConversations.unshift(newConv)
                } else {
                    newConversations.push(conv);
                }
            }
            return newConversations;
        }
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
            return state.map(conv => {
                if (conv._id === action.convId) {
                    return {
                        ...conv,
                        ...action.patch
                    } as MergedConversation
                }
                return conv;
            })
        case 'conversations/addedPreviousMessages':
            return state.map(conv => {
                if (conv._id === action.convId) {
                    return {
                        ...conv, 
                        messages: 'messages' in conv  ? [...action.prevMsgs, ...conv.messages] : [...action.prevMsgs]
                    }
                }
                return conv
            })
        case 'conversations/addedANewMessage': {
            const newConversations: typeof state = [];

            for (let conv of state) {
                if (conv._id === action.convId) {
                    const newConv = {
                        ...conv, 
                        last_message: action.newMsg,
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
        case 'conversation/modifiedMembersMeta':
            return (state as MergedConversation[]).map(conv => {
                if (conv._id === action.convId) {
                    if (action.action === 'set') {
                        return {
                            ...conv,
                            members_meta: action.newMembersMeta
                        }
                    }

                    if (typeof conv.members_meta === 'string') {
                        return conv;
                    }

                    if (action.action === 'add') {
                        return {
                            ...conv,
                            members_meta: [
                                ...conv.members_meta,
                                ...action.newMembersMeta
                            ]
                        }
                    }

                    //deleting a memberMeta
                    let newMembersMeta: Pick<MembersMeta, 'members_meta'>['members_meta'] = [];
                    conv.members_meta.forEach(memberMeta => {
                        if (memberMeta.user_id !== action.userIdToRemove) {
                            newMembersMeta.push(memberMeta);
                        }
                    })

                    return {
                        ...conv,
                        members_meta: newMembersMeta 
                    }
                }

                return conv;
            })
        case 'conversation/updatedLastSeen':
            return state.map(conv => {
                //if conv doesn't exist yet in the db
                if (!('members_meta' in conv)) {
                    return conv
                }

                //if members_meta is not populated
                if (typeof conv.members_meta === 'string') {
                    return conv
                }

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
        case 'conversations/updatedDelivered':
            return state.map(conv => {
                if (!('messages' in conv)) {
                    return conv;
                }

                if (conv._id === action.convId) {
                    const newMessages = conv.messages?.map(message => {
                        if (message._id === action.msgId) {
                            return {
                                ...message,
                                is_delivered: true
                            };
                        }

                        return message;
                    })

                    return {
                        ...conv,
                        messages: newMessages
                    }
                }

                return conv;
            })
        case 'conversations/msgHasSent':
            //Update date_sent and _id to mirror its document in db
            return state.map(conv => {
                if (conv._id === action.convId) {
                    const newMessages = (conv as MergedConversation).messages?.map(msg => {
                        if (msg._id === action.msgId) {
                            return {
                                ...msg,
                                _id: action.newMsgId,
                                isSent: true,
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
        case 'conversation/modifiedMembers':
            return state.map(conv => {
                if (conv._id === action.convId) {
                    if (action.action === 'set' || action.action === 'add') {
                        return {
                            ...conv,
                            members: action.action === 'set' ? action.members : [
                                ...conv.members,
                                ...action.members
                            ]
                        }
                    }

                    //Removing a member
                    const newMembers: User[] = [];
                    for (let member of conv.members as User[]) {
                        if (member._id !== action.memberIdToRemove) {
                            newMembers.push(member);
                        }
                    }

                    return {
                        ...conv,
                        members: newMembers
                    }
                }
                return conv;
            }) as typeof state
        case 'conversations/stateReset': 
            return [];
        default:
            return state;
    }
}

export default conversations;;