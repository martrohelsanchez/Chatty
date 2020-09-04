import {UserInfoActionTypes, UserInfo} from '../actions/userInfoActions';

type UserInfoState = UserInfo | null;

export default (state: UserInfoState = null, action: UserInfoActionTypes) =>  {
    switch (action.type) {
        case 'userInfo/setUserInfo':
            return action.userInfo;
        default:
            return state;
    }
}