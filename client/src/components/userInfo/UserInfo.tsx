import React from 'react';

import * as S from './UserInfo.styles';
import cross from 'images/cross.svg';

interface UserInfoProps {
    convName?: string,
    bio?: string,
    profilePic?: string,
    header?: string
    isSetUserScreen: boolean;
    className?: string;
}

const UserInfo = ({convName, bio, profilePic, header, isSetUserScreen, className}: UserInfoProps) => {

  return (
    <S.UserInfoCont>
      <S.Header pic={header}>
        {!header && isSetUserScreen ? (
          <S.Cross src={cross} />
        ) : (
          null
        )}
        <S.OuterCircle>
          <S.ConvPic pic={profilePic}>
            {!profilePic && isSetUserScreen ? (
              <S.Cross src={cross} />
            ) : (
              null
            )}
          </S.ConvPic>
        </S.OuterCircle>
      </S.Header>  
      <S.BioContainer>
        <S.ConvName>
          {convName}
        </S.ConvName>
        <S.Bio>
          {bio}
        </S.Bio>
      </S.BioContainer>
    </S.UserInfoCont>       
  )
}

export default UserInfo;