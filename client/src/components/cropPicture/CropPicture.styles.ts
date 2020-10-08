import styled from 'styled-components';

import {ChittyName, NextBtn, PrussianBlueBg as prussianBlueBg} from 'shared/styles';

export const PopUpContainer = styled.div`
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    background-color: transparent;
    height: 100vh;
    width: 100vw;
`;

export const PrussianBlueBg = styled(prussianBlueBg)`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
`;

export const PopUp = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    background-color: ${({theme}) => theme.dark.primary};
    height: 80vh;
    width: 90vw;
    max-width: 500px;
    margin: 0 auto;
    z-index: 100;
`;

export const CropperContainer = styled.div`
    background-color: white;
    position: relative;
    height: 55%;
    width: 100%;
`;

export const Cancel = styled(NextBtn)`
    margin-right: 20%;
    /* margin-left: -20%; */
`;

export const ImagePreview = styled.img<{onSide: 'width' | 'height'}>`
    height: ${({ onSide }) => onSide === 'height' ? '75vh' : null};
    width: ${({onSide}) => onSide === 'width' ? '90%' : null};
    max-width: ${({onSide}) => onSide === 'width' ? '700px' : null};
    background-color: ${({theme}) => theme.dark.secondary}; 
    border: 10px solid white;
    z-index: 10;

    @media all and (max-width: ${({ theme }) => theme.mobile}) {
        & {
            border: 2px solid white;
        }
    }
`;

export const BtnsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1 1 auto;
    width: 20%;
    max-width: 100px;
    margin: 0 auto;
`;

export {ChittyName, NextBtn};