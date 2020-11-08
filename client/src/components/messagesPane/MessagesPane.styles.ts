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
    width: 95%;
    margin: 30px auto 0 auto;
    border-radius: 20px;
    padding: 20px 20px;
    box-sizing: border-box;

    @media all and (max-width: ${({ theme }) => theme.mobile}) {
        & {
            margin: 5px auto 0 auto;
            padding: 5px 10px;
        }
    }
`;

export const ConvName = styled.p`
    font-weight: bolder;
    font-size: 1.6rem;

    @media all and (max-width: ${({ theme }) => theme.mobile}) {
        & {
            font-size: 1rem;
        }
    }
`;

export const OuterCircle = styled(outerCircle)<{ insert: boolean }>`
    flex-shrink: 0;
    position: ${({ insert }) => insert ? 'relative' : 'absolute'};;
    margin: ${({insert}) => insert ? '0 20px 0 0' : '50px auto 0 auto'};
    z-index: 10;
    left: 0;
    right: 0;
    height: ${({insert}) => insert ? '45px' : '82px'};
    width: ${({ insert }) => insert ? '45px' : '82px'};
    padding-top: 0;
    box-sizing: border-box;

    @media all and (max-width: ${({ theme }) => theme.mobile}) {
        & {
            height: ${({insert}) => insert ? '45px' : '50px'};
            width: ${({ insert }) => insert ? '45px' : '50px'};
        }
    }
`;

export const ConvPic = styled(convPic)<{insert: boolean}>`
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    margin: 0 auto 0 auto;
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