import uniqid from 'uniqid';

import {ConvDecoy} from "shared/types/dbSchema";

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