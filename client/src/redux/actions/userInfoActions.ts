export type UserInfoActionTypes = SetUserInfoAction;

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
        type: 'userInfo/setUserInfo',
        userInfo 
    }
}