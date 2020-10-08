import styled from 'styled-components';
import {PrussianBlueBg as prussianBlueBg, NextBtn as nextBtn, ChittyName} from 'shared/styles';

export const PrussianBlueBg = styled(prussianBlueBg)`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

export const NextBtn = styled(nextBtn) <{canProceed: boolean}>`
    display: block;
    margin: 100px auto 0 auto;
    opacity: ${({canProceed}) => canProceed ? '1' : '.3'};
`;

export {nextBtn, ChittyName}