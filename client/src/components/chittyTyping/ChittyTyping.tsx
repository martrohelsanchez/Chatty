import React from 'react';

import chittyMascot from 'images/chitty_mascot.svg'
import Typing from 'components/typing/Typing';
import * as S from './ChittyTyping.styles';
import { Variants } from 'framer-motion';

interface ChittyTypingProps {
    isTyping: boolean;
}

const ChittyTyping = ({isTyping}: ChittyTypingProps) => {
    return (
        <S.ChittyTyping
            animate={isTyping ? 'typing' : 'notTyping'}
        >
            <S.Cont>
                <S.ChittyMascot 
                    mascot={chittyMascot}
                    variants={chittyMascotVariant}
                    initial={false}
                >
                </S.ChittyMascot>
                {/* <S.TypingCont>
                    <S.TypingSizing>
                        <Typing forMascot={true} />
                    </S.TypingSizing>
                </S.TypingCont> */}
            </S.Cont>
        </S.ChittyTyping>
    )
}

const chittyMascotVariant: Variants = {
    typing: {
    },
    notTyping: {
        // paddingTop: 'min(100%, 200px)',
        paddingTop: '200px',
        width: '100%',
        maxWidth: '200px'
    }
}

export default ChittyTyping;