import styled from 'styled-components';
import scrollRetract from 'components/scrollRetract/ScrollRetract';

export const ScrollRetract = styled(scrollRetract)`
    overflow: auto;
    display: flex;
    flex-direction: column;
    flex: 1 1 100%;
    font-weight: light; 
    font-size: 1.2rem;
    width: 100%;
    padding: 0 2.5%;
    margin: 0 auto;
    box-sizing: border-box;
`;

export const TypingCont = styled.div`
    position: relative;
    width: 75px;
    margin: 30px 0 0 0;
`;