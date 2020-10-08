import styled from 'styled-components';
import {OuterCircle as outerCircle, ConvPic as convPic} from 'shared/styles';

export const MessagePane = styled.div<{ showInMobile: boolean }>`
    background-color: ${({theme}) => theme.dark.secondary};
    display: flex;
    flex: 3 1 0%;
    flex-direction: column;
    position: relative;
    justify-content: space-between;

    @media all and (max-width: ${({theme}) => theme.mobile}) {
        & {
            display: ${({showInMobile}) => showInMobile ? 'flex' : 'none'};
        }
    }
`

export const ConvNameCont = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: ${({theme}) => theme.dark.primary};
    margin: 20px 0 0 0;
    width: 95%;
    margin: 30px auto 0 auto;
    border-radius: 20px;
    padding: 20px 20px;
    box-sizing: border-box;
`;

export const ConvName = styled.p`
    font-weight: bolder;
    font-size: 1.6rem;
`;

export const OuterCircle = styled(outerCircle) `
    position: absolute;
    margin: 50px auto 0 auto;
    z-index: 10;
    left: 0;
    right: 0;
    height: 82px;
    width: 82px;
    padding-top: 0;

    @media all and (max-width: ${({ theme }) => theme.mobile}) {
        & {
            height: 70px;
            width: 70px;
            margin: 60px auto 0 auto;
        }
    }
`;

export const ConvPic = styled(convPic)`
    height: 75px;
    width: 75px;
    z-index: 11;
    margin: 0 auto;
    align-self: center;

    @media all and (max-width: ${({ theme }) => theme.mobile}) {
        & {
            height: 62px;
            width: 62px;
        }
    }
`;

export const InfoBtn = styled.img`
    display: none;
    height: 30px;

    @media all and (max-width: ${({ theme }) => theme.mobile}) {
        & {
            display: inline-block;
        }
    }
`;