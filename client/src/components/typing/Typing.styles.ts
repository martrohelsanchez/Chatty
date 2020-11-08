import styled from 'styled-components';
import {motion} from 'framer-motion';


export const TypingBody = styled.div<{forMascot: boolean}>`
    position: relative;
    background-color: #efa985;
    border-radius: 200px;
    padding-top: ${({forMascot}) => forMascot ? '0px' : '50%'};
    height: ${({forMascot}) => forMascot ? '100%' : null};
    margin: 0 auto;
    width: 100%;
`;

export const Dot = styled(motion.span)`
    display: inline-block;
    background-color: #003a47;
    border-radius: 50%;
    padding-top: min(20%, 70px);
    width: 20%;
    max-width: 70px;
    flex: 0 0 auto;
`;

export const DotsCont = styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: absolute;
    width: 100%;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    box-sizing: border-box;
    padding: 0 10%;
`;

export const TypingCont = styled.div<{forMascot: boolean}>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: ${({forMascot}) => forMascot ? '100%' : null};
    /* max-width: 500px; */
`;