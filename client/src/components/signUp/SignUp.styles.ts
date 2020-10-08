import styled from 'styled-components';
import {LogIn, Register, Err} from 'components/logIn/Login.styles';

import {
    ChittyMascot, 
    UserInfoInput as Input, 
    NextBtn as nextBtn,
    ChittyName
} from 'shared/styles';
import loading from 'components/loading/Loading';

export const SignUp = styled(LogIn)``;

export const NextBtn = styled(nextBtn)`
    display: inline-block;
    margin: 60px auto 0 auto;
`;

export const Loading = styled(loading)`
    display: inline-block;
    margin: 60px auto 0 auto;
`;

export const BackBtn = styled(nextBtn)`
    display: inline-block;
    transform: rotateY(180deg);
    margin: 60px 20px 0 auto;
`;

export const ToLogIn = styled(Register)``;

export {ChittyMascot, Input, ChittyName, Err};