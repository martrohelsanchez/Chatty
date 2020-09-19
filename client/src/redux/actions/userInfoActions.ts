export type UserInfoActionTypes = 
    | ReturnType<typeof setUserInfo>
    | ReturnType<typeof resetUserInfo>

export interface UserInfo {
    userId: string;
    username: string
}

interface SetUserInfoAction {
    type: 'userInfo/setUserInfo',
    userInfo: UserInfo
}

export const setUserInfo = (userInfo: UserInfo): SetUserInfoAction => {
    return {
        type: 'userInfo/setUserInfo' as 'userInfo/setUserInfo',
        userInfo 
    }
}

export const resetUserInfo = () => {
    return {
        type: 'userInfo/stateReset' as 'userInfo/stateReset'
    }
}