import styled from 'styled-components';
import {OuterCircle as outerCircle, ConvPic as convPic} from 'shared/styles';

export const Header = styled.div<{pic: string | undefined}>`
    background-color: ${({theme}) => theme.dark.secondary};
    background-image: url(${({pic}) => pic});
    background-size: cover;
    width: 90%;
    padding-top: 44.5059%;
    border-radius: 10px;
    margin: 5% auto;
    position: relative;
`;

export const BioContainer = styled.div`
    background-color: ${({theme}) => theme.dark.secondary};
    width: 90%;
    margin: 0 auto 25px auto;
    border-radius: 10px;
    padding: 30px 20px;
    box-sizing: border-box;
`;

export const ConvName = styled.p`
    text-align: center;
    font-weight: bold;
    font-size: 1.4rem;
`;

export const Bio = styled.p`
    margin: 10px 0 0 0;
    font-size: .9rem;
    font-weight: lighter;
`;

export const OuterCircle = styled(outerCircle)`
    margin: 0 auto;
    position: absolute;
    top: 77%;
    left: 0;
    right: 0;
    box-sizing: border-box;

    @media all and (max-width: ${({theme}) => theme.mobile}) {
        & {
            top: 82%;
            height: 20vw;
            width: 20vw;
            max-height: 100px;
            max-width: 100px;
        }
    }
`; 

export const ConvPic = styled(convPic)`
    @media all and (max-width: ${({theme}) => theme.mobile}) {
        & {
            height: 18vw;
            width: 18vw;
            max-height: 90px;
            max-width: 90px;
        }
    }
`;

export const UserInfoCont = styled.div`
    color: white;
    width: 100%;
    max-width: 500px;
    margin: auto;
`;

export const Cross = styled.img`
    position: absolute;
    left: 0;
    right: 0;
    top: 35%;
    margin: auto;
    height: 25px;
`;

export {outerCircle, convPic};