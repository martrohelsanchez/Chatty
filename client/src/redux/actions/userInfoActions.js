export function setUserInfo(userInfo) {
    return {
        type: 'userInfo/setUserInfo',
        payload: {
            userInfo 
        }
    }
}