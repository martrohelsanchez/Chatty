import React from 'react';
import styled from 'styled-components';
import { useRouteMatch, Route } from 'react-router-dom';

const StyledInfoPane = styled.div<{showInMobile: boolean}>`
    background-color: ${({theme}) => theme.dark.primary};
    flex: 1.2 1 0;

    @media all and (max-width: ${({theme}) => theme.mobile}) {
        & {
            display: ${({showInMobile}) => showInMobile ? 'block' : 'none'};
        }
    }
`

const InfoPane = () => {
    const infoPaneMatchRoute = useRouteMatch('/chat/:convId/info');
    const showInMobile = infoPaneMatchRoute ? infoPaneMatchRoute.isExact : false;

    return (
        <StyledInfoPane showInMobile={showInMobile}>
            hello world
        </StyledInfoPane>
    )
}

export default InfoPane;