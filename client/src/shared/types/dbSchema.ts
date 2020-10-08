//Exact schema from User Mongoose Model without the password field
export interface User {
    _id: string;
    username: string;
    profile_pic?: string;
    header?: string;
    bio?: string;
}

//Exact schema from Message Mongoose model
export interface Message {
    _id: string;
    conversation_id: string;
    sender: string;
    sender_username: string;
    message_body: string;
    date_sent: number;
    is_delivered: boolean;
}

//Exact schema from Conversation Mongoose model
export interface Conversation {
    _id: string;
    group_name?: string;
    is_group_chat: boolean;
    members: string[];
    conversation_pic: {
        [key: string]: string
    };
    last_message?: Message;
    created_at: number;
    last_updated: number;
    members_meta: string;
    members_username: string[];
    members_meta_id: string;
    group_bio?: string;
    group_header?: string;
} 

//Exact schema from MembersMeta Mongoose model
export interface MembersMeta {
    _id: string;
    conversation_id: string;
    members_meta: {
        user_id: string;
        last_seen: number;
    }[];
}

export interface LastSeen {
    _id: string,
    user_id: string,
    last_seen: {
        [key: string]: number
    }
}

export interface Conversation_LastMessage extends Omit<Conversation, 'last_message'>{
    last_message: Message
}

export interface Conversation_Members extends Omit<Conversation, 'members'> {
    members: User[];
} 

export interface ConvDecoy
  extends Omit<
    MergedConversation,
    "last_message" | "created_at" | "last_updated" | "members_meta" | 
    "conversation_pic" | "members_username" | "convHasCreated" | "members" | "members_meta_id"
  > {
    members: string[];
    convHasCreated: false;
    searchedUser: User;
}

export interface MergedConversation extends Omit<Conversation, 'members' | 'members_meta'>{
    members: string[] | User[];
    members_meta: string | Pick<MembersMeta, 'members_meta'>['members_meta'];
    messages?: (Message & {
        isSent: boolean
    })[];
    convHasCreated: true;
}

export interface PopulatedConversation extends Omit<Conversation, 'members' | 'members_meta'>{
    members: User[];
    members_meta: Pick<MembersMeta, 'members_meta'>['members_meta'];
    messages: (Message & {
        isSent: boolean
    })[];
    convHasCreated: true;
}

export interface MessageRedux extends Message{
    isSent: boolean;
}