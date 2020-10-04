import React from 'react';

import * as S from './CropPicture.styles';
import cancelIcon from 'images/cancel.svg';
import nextIcon from 'images/next.svg';

interface CropPictureProps {
    isSettingHeader: boolean;
    isSettingProfile: boolean;
}

const CropPicture = ({isSettingHeader, isSettingProfile}: CropPictureProps) => {
    return (
        <S.SherpaBlueBg>
            <S.ChittyName>
                Chitty
            </S.ChittyName>
            <S.Cancel src={cancelIcon} />
            <S.NextBtn src={nextIcon} />
        </S.SherpaBlueBg>
    )
}

export default CropPicture;