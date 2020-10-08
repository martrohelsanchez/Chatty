import React, {useContext} from 'react';
import {useHistory} from 'react-router-dom';

import * as S from './UserProfile.styles';
import UserInfo from 'components/userInfo/UserInfo';
import {IsUserJustRegistered} from 'pages/appRoute/AppRoute';
import nextIcon from 'images/next.svg';

import {useSelector} from 'react-redux';
import {rootState} from 'redux/store';

const UserProfile = () => {
    const user = useSelector((state: rootState) => state.userInfo);
    const isUserJustReg = useContext(IsUserJustRegistered);
    const history = useHistory();
    let canProceed;

    if (isUserJustReg.justRegistered) {
        if (user.profile_pic && user.header && user.bio) {
            canProceed = true;
        } else {
            canProceed = false;
        }
    } else {
        canProceed = true;
    }

    const handleNextClick = () => {
        if (canProceed) {
            history.push('/chat');
        }
    }

    return (
        <S.PrussianBlueBg>
            <S.ChittyName>
                Chitty
            </S.ChittyName>
            <div style={{width: '100vw'}}>
                <UserInfo 
                    convName={user.username} 
                    bio={user.bio} 
                    profilePic={user.profile_pic}
                    header={user.header}
                    isSetUserScreen={true}
                />
                <S.NextBtn 
                    canProceed={canProceed} 
                    src={nextIcon} 
                    onClick={handleNextClick} 
                />
            </div>
        </S.PrussianBlueBg>
    )
}

export default UserProfile;