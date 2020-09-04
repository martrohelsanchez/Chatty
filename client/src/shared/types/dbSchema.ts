export interface User {
    _id: string;
    username: string;
}

//Exact schema from Message Mongoose model
export interface Message {
    _id: string;
    conversation_id: string;
    sender: string;
    message_body: string;
    date_sent: number;
}

//Exact schema from Conversation Mongoose model
export interface Conversation {
    _id: string;
    group_name: string;
    is_group_chat: boolean;
    members: string[];
    conversation_pic: string;
    last_message: {
        message_body: string;
        sender_username: string;
        date_sent: number;
        sender_id: string;
        is_delivered: boolean;
    };
    is_chatroom: boolean;
    created_at: number;
    last_updated: number;
    members_meta: {
        user_id: string;
        last_seen: number;
        delivered: boolean;
    }[];
}

export interface ConversationPopulateMembers extends Omit<Conversation, 'members'> {
    members: User[];
} 

export interface MessagePopulateSender extends Omit<Message, 'sender'> {
    sender: User;
}