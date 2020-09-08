import axios from 'axios';
import {MembersMeta, ConversationPopulateMembers} from '../shared/types/dbSchema';

export interface UserAuthRes {
    userId: string;
    username: string;
    isAuth: boolean;
    csrfToken: string;
}

export async function logInReq(
    username: string, 
    cb?: (UserAuthRes) => void, 
    errCb?: (err: Error) => void
) {
    try {
        const {data} = await axios.post<UserAuthRes>('/user/logIn', {
            username: username.trim()
        }, {
            withCredentials: true
        });

        if (cb) {
            cb(data);
        } else {
            return data;
        }
    } catch (err) {
        if (errCb) {
            errCb(err);
        } else {
            throw err;
        }
    }
}

export const reAuthReq = async (
    cb?: (data: UserAuthRes) => void, 
    errCb?: (err: Error) => void
) => {
    try {
        const {data} = await axios.post<UserAuthRes>('/user/reAuth', {}, {
            withCredentials: true
        });

        if (cb) {
            cb(data)
        } else {
            return data
        }
    } catch (err) {
        if (errCb) {
            errCb(err)
        } else {
            throw err;
        }
    }
}

interface UpdatedSeen {
    updated_seen: {
        convId: string,
        userId: string,
        new_seen: number
    }
}

export const seenConvReq = async (
    convId: string, 
    cb?: (data: UpdatedSeen) => void, 
    errCb?: (err: Error) => void
) => {
    try {
        const {data} = await axios.patch<UpdatedSeen>(`/chat/conversations/${convId}/seen`, {}, {
            withCredentials: true
        });

        if (cb) {
            cb(data);
        } else {
            return data;
        }
    } catch (err) {
        if (errCb) {
            errCb(err);
        } else {
            throw err;
        }
    }
}

export const getConversationsReq = async (
    limit: number, 
    before: number | null = null, 
    cb?: (data: {conversations: ConversationPopulateMembers[]}) => void, 
    errCb?: (err: Error) => void
) => {
    try {
        const res = await axios.get<{conversations: ConversationPopulateMembers[]}>('/chat/conversations', {
            params: {  
                before: before,
                limit: 10
            }
        });

        if (cb) {
            cb(res.data);
        } else {
            return res.data;
        }
    } catch (err) {
        if (errCb) {
            errCb(err);
        } else {
            throw err;
        }
    }
}

export const updateMsgIsDeliveredReq = async (
    convId: string, 
    senderId: string,
    errCb?: (err: Error) => void
) => {
    try {
        const res = await axios.patch(`/chat/conversations/${convId}/deliver`, {
            senderId
        })
    } catch (err) {
        if (errCb) {
            errCb(err);
        } else {
            throw err;
        }
    }
}

//Get one conversation where the members are exactly what was given
export const getConversationByMembersReq = async (
    convMembers: string[], 
    cb?: (data: {conversation: ConversationPopulateMembers}) => void, 
    errCb?: (err: Error) => void
) => {
    try {
        const {data} = await axios.get<{conversation: ConversationPopulateMembers}>('/chat/conversation', {
            params: {
                members: convMembers
            }
        });

        if (cb) {
            cb(data);
        } else {
            return data;
        }
    } catch (err) {
        if (errCb) {
            errCb(err);
        } else {
            throw err;
        }
    }
}