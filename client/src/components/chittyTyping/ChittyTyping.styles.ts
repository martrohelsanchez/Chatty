import styled from 'styled-components';
import { motion } from 'framer-motion';

export const ChittyTyping = styled(motion.div)`
    position: relative;
    width: 100%;
    height: 40%;
    background-color: black;
`;

export const ChittyMascot = styled(motion.div)<{ mascot: string }>`
    position: relative;
    /* left: 50%; */
    background-image: url(${({ mascot }) => mascot});
    background-size: auto 80%;
    background-repeat: no-repeat;
    background-position: center;
    /* padding-top: min(100%, 200px); */
    /* padding-top: 33.33%;
    width: 33.33%; */
    /* max-width: 200px; */
    margin: 0 auto 60px auto;
    border-radius: 300px;
    background-color: #ead3b7;
`;

export const TypingSizing = styled.div`
    position: relative;
    /* padding-top: min(100%, 200px); */
    padding-top: 33.33%;
    width: 33.33%;
    /* height: 100%; */
    /* max-width: 200px; */
    margin: 0 auto;
`;

export const TypingCont = styled.div`
    position: absolute;
    top: 0;
    /* left: 100%; */
    /* left: 0; */
    width: 100%;
    height: 100%;
`;

export const Cont = styled.div`
    height: 100%;
    width: 100%;
    /* transform: scale(0.5) translateX(-45%); */
`;