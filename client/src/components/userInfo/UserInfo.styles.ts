import styled from 'styled-components';
import {OuterCircle as outerCircle, ConvPic as convPic} from 'shared/styles';

export const Header = styled.div<{pic: string | undefined, isSetUserScreen: boolean, isGrp: boolean}>`
    background-color: ${({theme, isSetUserScreen}) => isSetUserScreen ? theme.dark.primary : theme.dark.secondary};
    background-image: url(${({pic}) => pic});
    background-size: cover;
    width: 90%;
    padding-top: 44.5059%;
    border-radius: 10px;
    margin: 5% auto;
    position: relative;

    &:hover {
        cursor: ${({isSetUserScreen, isGrp}) => isSetUserScreen || isGrp ? 'pointer' : 'default'};
    }
`;

export const BioContainer = styled.div<{isSetUserScreen}>`
    background-color: ${({theme, isSetUserScreen}) => isSetUserScreen ? theme.dark.primary : theme.dark.secondary};
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 90%;
    margin: 0 auto 25px auto;
    border-radius: 10px;
    padding: 8% 20px;
    box-sizing: border-box;
`;

export const ConvName = styled.p`
    text-align: center;
    font-weight: bold;
    font-size: 1.4rem;
`;

export const Bio = styled.p`
    display: inline-block;
    margin: 10px 0 0 0;
    font-size: .9rem;
    font-weight: lighter;
`;

export const BioInput = styled.textarea`
    display: block;
    background-color: transparent;
    border: none;
    resize: none;
    color: white;
    font-family: ${({theme}) => theme.font.primary};    
    font-size: .9rem;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;

    &:focus {
        outline: none;
    }
`;

export const OuterCircle = styled(outerCircle)`
    margin: 0 auto;
    position: absolute;
    top: 77%;
    left: 0;
    right: 0;
    box-sizing: border-box;
`; 

export const ConvPic = styled(convPic)`
    position: absolute;
    left: 0;
    right: 0;
    margin: -95.5% auto 0 auto;
`;

export const UserInfoCont = styled.div`
    color: white;
    width: 100%;
    max-width: 600px;
    margin: auto;
`;

export const Cross = styled.img`
    position: absolute;
    left: 0;
    right: 0;
    top: 35%;
    margin: auto;
    height: 15%;
`;

export {outerCircle, convPic};