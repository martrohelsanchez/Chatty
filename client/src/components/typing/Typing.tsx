import React from 'react';
import {Variants} from 'framer-motion';

import * as S from './Typing.styles';

const arrDots = [1, 2, 3];

interface TypingProps {
    className?: string;
    forMascot: boolean;
}

const Typing = ({className, forMascot}: TypingProps) => {
    return (
        <S.TypingCont
            className={className}
            forMascot={forMascot}
        >
            <S.TypingBody forMascot={forMascot} >
                <S.DotsCont>
                    {arrDots.map(num => (
                        <S.Dot
                            key={num}
                            custom={num}
                            variants={variant}
                            // animate={isAnimationInView ? 'start' : 'stop'}
                            animate={'start'}
                        >
                        </S.Dot>
                    ))}
                </S.DotsCont>
            </S.TypingBody>
        </S.TypingCont>
    )
}

const variant: Variants = {
    start: (i: number) => ({
        y: ['0%', '-90%', '0%'],
        transition: {
            delay: i * 0.15,
            repeat: Infinity,
            repeatDelay: .5
        }
    }),
    stop: {
        y: ['0%', '0%', '0%']
    }
}

export default Typing