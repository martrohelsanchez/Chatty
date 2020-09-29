import uniqid from 'uniqid';

import {ConvDecoy, MergedConversation, LastSeen} from "shared/types/dbSchema";
import store from 'redux/store';

export const createConvDummyDoc = (
  members: string[]
): ConvDecoy => {
  return {
    _id: uniqid() as string,
    convHasCreated: false,
    is_group_chat: false,
    members: members
  };
};


export const createMsgObj = (currConvId: string, senderId: string, senderUsername: string, messageBody: string) => {
  return {
    _id: uniqid() as string,
    conversation_id: currConvId,
    sender: senderId,
    message_body: messageBody,
    date_sent: Date.now(),
    isSent: false,
    is_delivered: false,
    sender_username: senderUsername
  }
}

export const findConvInRedux = (targetConv: string | null) => {
  const conversations = store.getState().conversations;
  return conversations.find(conv => conv._id === targetConv);
}

export const knowIfHasRead = (
  lastReadDoc: LastSeen | null,
  conv: MergedConversation,
  userId: string
) => {
  if (lastReadDoc === null) {
    return true
  }

  //If members_meta is not populated
  if (typeof conv.members_meta === 'string') {
    //Use LastMessage document
    return lastReadDoc.last_seen[conv._id] >= conv.last_message.date_sent
  }

  return (conv.members_meta.find(member => member.user_id === userId)?.last_seen as number) >= conv.last_message.date_sent;
}