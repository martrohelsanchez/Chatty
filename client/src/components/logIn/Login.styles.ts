import styled from 'styled-components';
import {Link} from 'react-router-dom';

import {
    ChittyMascot, 
    UserInfoInput as Input, 
    PrussianBlueBg,
    NextBtn,
    ChittyName
} from 'shared/styles';

export const LogIn = styled(PrussianBlueBg)`
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const LogInBtn = styled(NextBtn)`
    margin: 60px auto 0 auto;
`;

export const Register = styled(Link)`
    display: block;
    text-decoration: none;
    color: ${({theme}) => theme.dark.thirdly};
    margin-left: 20px;
`;

export const Wrapper = styled.div`
    display: block;
`;

export const Err = styled.p`
    color: ${({theme}) => theme.cinnabar};
    text-align: center;
`;

export {ChittyMascot, Input, ChittyName};