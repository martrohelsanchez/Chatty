import React, { useContext, useState } from 'react';

import * as S from './UserProfile.styles';
import UserInfo from 'components/userInfo/UserInfo';
import {IsUserJustRegistered} from 'pages/appRoute/AppRoute';
import nextIcon from 'images/next.svg';

import {useSelector} from 'react-redux';
import {rootState} from 'redux/store';
import CropPicture from 'components/cropPicture/CropPicture';

const UserProfile = () => {
    const [isSettingHeader, setIsSettingHeader] = useState(false);
    const [isSettingProfile, setIsSettingProfile] = useState(false);
    const user = useSelector((state: rootState) => state.userInfo);
    const isUserJustReg = useContext(IsUserJustRegistered);

    return (
        <>
        {isSettingProfile || isSettingHeader ? (
            <CropPicture isSettingHeader={isSettingHeader} isSettingProfile={isSettingHeader} />
        ) : (
            <S.SherpaBlueBg>
                <S.ChittyName>
                    Chitty
                </S.ChittyName>
                <div style={{height: '100px'}}></div>
                <UserInfo 
                    convName={user.username} 
                    bio={user.bio} 
                    profilePic={user.profile_pic}
                    header={user.header}
                    isSetUserScreen={true}
                    setIsSettingHeader={setIsSettingHeader}
                    setIsSettingProfile={setIsSettingProfile}
                />
                <S.NextBtn src={nextIcon} />
            </S.SherpaBlueBg>
        )}
        </>
    )
}

export default UserProfile;