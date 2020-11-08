import React from 'react';

import Typing from 'components/typing/Typing'
import * as S from './SplashScreen.styles';

function SplashScreen() {
    return (
        <S.PrussianBlueBg>
            <S.Cont>
                <Typing forMascot={false} />
            </S.Cont>
        </S.PrussianBlueBg>
    )
}

export default SplashScreen;