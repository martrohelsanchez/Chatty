import {Message, ConvDecoy, MembersMeta, User, Conversation_LastMessage} from "../../shared/types/dbSchema";

export type ConversationActionTypes = 
    | ReturnType<typeof retrieveConversations>
    | ReturnType<typeof addConv>
    | ReturnType<typeof deleteConv>
    | ReturnType<typeof patchConv>
    | ReturnType<typeof addPrevMsgs>
    | ReturnType<typeof addNewMsg>
    | ReturnType<typeof modifyMembersMeta>
    | ReturnType<typeof updateLastSeen>
    | ReturnType<typeof updateDelivered>
    | ReturnType<typeof msgSent>
    | ReturnType<typeof modifyMembers>
    | ReturnType<typeof resetConvState>

export const retrieveConversations = (
    retrieveConv: (Conversation_LastMessage)[]
) => {
    return {
        type: 'conversations/retrievedConversations' as 'conversations/retrievedConversations',
        retrieveConv,
    }
}

export const addConv = (
    conv: (Conversation_LastMessage & {convHasCreated: boolean}) | ConvDecoy
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
    patch: Partial<Conversation_LastMessage & {convHasCreated: boolean}>
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
      prevMsgs: prevMsgs.map(msg => ({
          ...msg,
          isSent: true
      })),
      convId,
    };
}

export const addNewMsg = (convId: string, newMsg: Message, isSent: boolean) => {
    return {
        type: 'conversations/addedANewMessage' as 'conversations/addedANewMessage',
        newMsg: {...newMsg, isSent},
        convId
    }
}

export const modifyMembersMeta = (
    convId: string, 
    action: 'set' | 'add' | 'remove',
    newMembersMeta: Pick<MembersMeta, 'members_meta'>['members_meta'],
    userIdToRemove?: string
) => {
    return {
        type: 'conversation/modifiedMembersMeta' as 'conversation/modifiedMembersMeta', 
        convId,
        newMembersMeta,
        action,
        userIdToRemove
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

export function updateDelivered(convId: string, msgId: string) {
    return {
        type: 'conversations/updatedDelivered' as 'conversations/updatedDelivered',
        msgId,
        convId
    }
}

export const msgSent = (
    msgId: string, convId: string, 
    newDateSent: number, newMsgId: string
) => {
    return {
        type: 'conversations/msgHasSent' as 'conversations/msgHasSent',
        msgId,
        convId,
        newDateSent,
        newMsgId
    }
}

export const modifyMembers = (
    convId: string,
    action: 'set' | 'add' | 'remove',
    members: User[],
    memberIdToRemove?: string
) => {
    return {
        type: 'conversation/modifiedMembers' as 'conversation/modifiedMembers',
        convId,
        action,
        members,
        memberIdToRemove
    }
}

export const resetConvState = () => {
    return {
        type: 'conversations/stateReset' as 'conversations/stateReset'
    }
}
