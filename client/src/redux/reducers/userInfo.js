export default function (state = null, action) {
    const {payload, type} = action;

    switch (type) {
        case 'userInfo/setUserInfo':
            return payload.userInfo
        default:
            return state
    }
}