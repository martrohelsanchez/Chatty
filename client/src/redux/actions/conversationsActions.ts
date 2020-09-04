import {Conversation, ConversationPopulateMembers, MessagePopulateSender} from '../../shared/types/dbSchema';

interface RetrieveConversationsAction {
    type: 'conversations/retrievedConversations';
    retrieveConv: ConversationPopulateMembers[];
}

interface AddConvAction {
    type: 'conversations/addedAConversation';
    conv: ConversationPopulateMembers
}

interface DeleteConvAction {
    type: 'conversations/deletedAConversation';
    convId: string;
}

interface PatchConvAction {
    type: 'conversations/patchedConversation';
    convId: string;
    patch: Partial<ConversationPopulateMembers>;
}

interface AddPrevMsgsAction {
    type: 'conversations/addedPreviousMessages';
    prevMsgs: MessagePopulateSender[];
    convId: string;
}

interface AddNewMsgAction {
    type: 'conversations/addedANewMessage';
    newMsg: MessagePopulateSender;
    convId: string
}

interface UpdateMembersMetaAction {
    type: 'conversation/updatedMembersMeta';
    newMembersMeta: Pick<Conversation, 'members_meta'>['members_meta'];
    convId: string;
}

interface UpdateLastSeenAction {
    type: 'conversation/updatedLastSeen';
    convId: string;
    userId: string;
    newSeen: number;
}

interface MsgSentAction {
    type: 'conversations/msgHasSent';
    msgId: string;
    convId: string;
    newDateSent: number;
    newMsgId: string
}

export type ConversationActionTypes = 
    | RetrieveConversationsAction
    | AddConvAction
    | DeleteConvAction
    | PatchConvAction
    | AddPrevMsgsAction
    | AddNewMsgAction
    | UpdateMembersMetaAction
    | UpdateLastSeenAction
    | MsgSentAction

//------------------------------------------------

export const retrieveConversations = (retrieveConv: ConversationPopulateMembers[]): RetrieveConversationsAction => {
    return {
        type: 'conversations/retrievedConversations',
        retrieveConv
    }
}

export const addConv = (conv: ConversationPopulateMembers): AddConvAction => {
    return {
        type: 'conversations/addedAConversation',
        conv
    }
}

export const deleteConv = (convId: string): DeleteConvAction => {
    return {
        type: 'conversations/deletedAConversation',
        convId
    }
}

export const patchConv = (convId: string, patch: Partial<ConversationPopulateMembers>): PatchConvAction => {
    return {
        type: 'conversations/patchedConversation',
        convId,
        patch
    }
}

export const addPrevMsgs = (convId: string, prevMsgs: MessagePopulateSender[]): AddPrevMsgsAction => {
    return {
        type: 'conversations/addedPreviousMessages',
        prevMsgs,
        convId
    }
}

export const addNewMsg = (convId: string, newMsg: MessagePopulateSender): AddNewMsgAction => {
    return {
        type: 'conversations/addedANewMessage',
        newMsg,
        convId
    }
}

export const updateMembersMeta = (convId: string, newMembersMeta: Pick<Conversation, 'members_meta'>['members_meta']): UpdateMembersMetaAction => {
    return {
        type: 'conversation/updatedMembersMeta', 
        newMembersMeta,
        convId
    }
}

export const updateLastSeen = (convId: string, userId: string, newSeen: number): UpdateLastSeenAction => {
    return {
        type: 'conversation/updatedLastSeen', 
        convId,
        userId,
        newSeen
    }
}

// export function updateDelivered(convId: string, deliveredMeta: ) {
//     return {
//         type: 'conversations/updatedDelivered',
//         payload: {
//             deliveredMeta,
//             convId
//         }
//     }
// }

export const msgSent = (msgId: string, convId: string, newDateSent: number, newMsgId: string) => {
    return {
        type: 'conversations/msgHasSent',
        msgId,
        convId,
        newDateSent,
        newMsgId
    }
}