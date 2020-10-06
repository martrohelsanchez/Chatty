import {UserInfoActionTypes, UserInfo} from '../actions/userInfoActions';

export default (state: UserInfo = null!, action: UserInfoActionTypes) =>  {
    switch (action.type) {
        case 'userInfo/setUserInfo':
            return action.userInfo;
        case 'userInfo/updatedProfilePic': 
            return {
                ...state,
                profile_pic: action.imgUrl
            }
        case 'userInfo/updatedHeader': 
            return {
                ...state,
                header: action.imgUrl
            }
        case 'userInfo/updatedUserbio': 
            return {
                ...state,
                bio: action.bio
            }
        case 'userInfo/stateReset':
            return null!;
        default:
            return state;
    }
};