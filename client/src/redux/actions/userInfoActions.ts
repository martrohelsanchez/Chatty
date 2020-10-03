import {User} from 'shared/types/dbSchema';

export type UserInfoActionTypes = 
    | ReturnType<typeof setUserInfo>
    | ReturnType<typeof resetUserInfo>

export interface UserInfo extends Omit<User, '_id'> {
    userId: string;
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