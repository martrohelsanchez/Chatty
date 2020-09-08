import {UserInfoActionTypes, UserInfo} from '../actions/userInfoActions';

export default (state: UserInfo = null!, action: UserInfoActionTypes) =>  {
    switch (action.type) {
        case 'userInfo/setUserInfo':
            return action.userInfo;
        default:
            return state;
    }
}