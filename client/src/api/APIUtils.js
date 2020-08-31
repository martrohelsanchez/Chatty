import axios from 'axios';

export async function logInReq(username, cb, errCb) {
    try {
        const {data} = await axios.post('/user/logIn', {
            username: username.trim()
        }, {
            withCredentials: true
        });

        if (cb) cb(data);

        return data;
    } catch (err) {
        if (errCb) {
            errCb(err);
        } else {
            throw err;
        }
    }
}

export async function reAuthReq(cb, errCb) {
    try {
        const {data} = await axios.post('/user/reAuth', {}, {
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

export async function seenConvReq(convId, convMembers, cb, errCb) {
    try {
        const {data} = await axios.patch(`/chat/conversations/${convId}/seen`, {
            convMembers: convMembers
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

export async function getConversationsReq(limit, before = null, cb, errCb) {
    try {
        const res = await axios.get('/chat/conversations', {
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

export async function updateMsgIsDeliveredReq(convId, senderId, cb, errCb) {
    try {
        const res = await axios.patch(`/chat/conversations/${convId}/deliver`, {
            senderId
        })

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