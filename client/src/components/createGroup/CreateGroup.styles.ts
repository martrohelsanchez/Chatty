import styled from 'styled-components';

import loading from 'components/loading/Loading';
import {PrussianBlueBg as prussianBlueBg, NextBtn as nextBtn} from 'shared/styles';

export const PrussianBlueBg = styled(prussianBlueBg)`
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
`;

export const Cont = styled.div`
    flex: 1 1 auto;
`;

export const GroupName = styled.input`
    display: block;
    background-color: ${({theme}) => theme.dark.primary};
    border-radius: 15px;
    height: 40px;
    width: 90%;
    max-width: 500px;
    border: none;
    padding: 0 30px;
    color: white;
    box-sizing: border-box;
    margin: 0 auto 30px auto;

    &:focus {
        outline: none;
    }
`;

export const PageName = styled.p`
    color: white;
    /* color: ${({theme}) => theme.dark.thirdly}; */
    text-align: center;
    margin: 0 auto 10px auto;
`;

export const NextBtn = styled(nextBtn)<{canProceed}>`
    display: block;
    margin: 50px auto 0 auto;
    opacity: ${({canProceed}) => canProceed ? '1' : '.3'};
`;

export const Loading = styled(loading)`
    display: block;
    margin: 50px auto 0 auto;
`;