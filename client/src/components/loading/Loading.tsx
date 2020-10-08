import React from 'react';

import * as S from './Loading.styles';
import loadingSpinnerIcon from 'images/loading_spinner.svg';

interface LoadingProps {
    style?: React.CSSProperties;
    className?: string;
}

function Loading({className, style}: LoadingProps) {
    return (
        <>
            <S.Spinner 
                style={style}
                className={className} 
                icon={loadingSpinnerIcon}
            ></S.Spinner>
        </>
    )
}

export default Loading