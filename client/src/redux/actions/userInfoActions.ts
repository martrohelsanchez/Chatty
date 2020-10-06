import {User} from 'shared/types/dbSchema';

export type UserInfoActionTypes = 
    | ReturnType<typeof setUserInfo>
    | ReturnType<typeof resetUserInfo>
    | ReturnType<typeof updateUserProfilePic>
    | ReturnType<typeof updateUserHeader>
    | ReturnType<typeof updateUserBio>

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

export const updateUserProfilePic = (imgUrl: string) => {
    return {
        type: 'userInfo/updatedProfilePic' as 'userInfo/updatedProfilePic',
        imgUrl 
    }
}

export const updateUserHeader = (imgUrl: string) => {
    return {
        type: 'userInfo/updatedHeader' as 'userInfo/updatedHeader',
        imgUrl
    }
}

export const updateUserBio = (bio: string) => {
    return {
        type: 'userInfo/updatedUserbio' as 'userInfo/updatedUserbio',
        bio 
    }
}

export const resetUserInfo = () => {
    return {
        type: 'userInfo/stateReset' as 'userInfo/stateReset'
    }
}