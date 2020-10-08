import React from 'react';

import Loading from '../loading/Loading';
import * as S from './SplashScreen.styles';

function SplashScreen() {
    return (
        <S.PrussianBlueBg>
            <Loading />
        </S.PrussianBlueBg>
    )
}

export default SplashScreen;