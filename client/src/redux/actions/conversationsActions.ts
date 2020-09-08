import {ConversationPopulateMembers, Message, Conversation, ConvDecoy} from "../../shared/types/dbSchema";

export type ConversationActionTypes = 
    | ReturnType<typeof retrieveConversations>
    | ReturnType<typeof addConv>
    | ReturnType<typeof deleteConv>
    | ReturnType<typeof patchConv>
    | ReturnType<typeof addPrevMsgs>
    | ReturnType<typeof addNewMsg>
    | ReturnType<typeof updateMembersMeta>
    | ReturnType<typeof updateLastSeen>
    | ReturnType<typeof msgSent>

export const retrieveConversations = (retrieveConv: ConversationPopulateMembers[]) => {
    return {
        type: 'conversations/retrievedConversations' as 'conversations/retrievedConversations',
        retrieveConv,
    }
}

export const addConv = (
    conv: (ConversationPopulateMembers & {convHasCreated: boolean}) | ConvDecoy
) => {
    return {
        type: 'conversations/addedAConversation' as 'conversations/addedAConversation',
        conv
    }
}

export const deleteConv = (convId: string) => {
    return {
        type: 'conversations/deletedAConversation' as 'conversations/deletedAConversation',
        convId
    }
}

export const patchConv = (
    convId: string, 
    patch: Partial<ConversationPopulateMembers>
) => {
    return {
        type: 'conversations/patchedConversation' as 'conversations/patchedConversation',
        convId,
        patch
    }
}

export const addPrevMsgs = (
    convId: string, 
    prevMsgs: Message[]
) => {
    return {
      type: "conversations/addedPreviousMessages" as "conversations/addedPreviousMessages",
      prevMsgs,
      convId,
    };
}

export const addNewMsg = (convId: string, newMsg: Message, is_sent: boolean) => {
    return {
        type: 'conversations/addedANewMessage' as 'conversations/addedANewMessage',
        newMsg: {...newMsg, is_sent},
        convId
    }
}

export const updateMembersMeta = (
    convId: string, 
    newMembersMeta: Pick<Conversation, 'members_meta'>['members_meta']
) => {
    return {
        type: 'conversation/updatedMembersMeta' as 'conversation/updatedMembersMeta', 
        newMembersMeta,
        convId
    }
}

export const updateLastSeen = (convId: string, userId: string, newSeen: number) => {
    return {
        type: 'conversation/updatedLastSeen' as 'conversation/updatedLastSeen', 
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
        type: 'conversations/msgHasSent' as 'conversations/msgHasSent',
        msgId,
        convId,
        newDateSent,
        newMsgId
    }
}