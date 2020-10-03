import React, { useContext } from 'react';

import * as S from './UserProfile.styles';
import UserInfo from 'components/userInfo/UserInfo';
import {IsUserJustRegistered} from 'pages/appRoute/AppRoute';

import {useSelector} from 'react-redux';
import {rootState} from 'redux/store';

const UserProfile = () => {
    const user = useSelector((state: rootState) => state.userInfo);
    const isUserJustReg = useContext(IsUserJustRegistered);

    console.log(user.header)

    return (
        <>
            <S.SherpaBlueBg>
                <div style={{height: '100px'}}></div>
                <UserInfo 
                    convName={user.username} 
                    bio={user.bio} 
                    profilePic={user.profile_pic}
                    header={user.header}
                    isSetUserScreen={true}
                />
            </S.SherpaBlueBg>
        </>
    )
}

export default UserProfile;