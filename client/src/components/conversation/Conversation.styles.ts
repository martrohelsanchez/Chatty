import styled from 'styled-components';
import {motion} from 'framer-motion';

export const Conversation = styled(motion.div)<{ isRead: boolean, isSelected: boolean }>`
    display: flex;
    align-items: center;
    width: 100%;
    padding: 10px 5%;
    background-color: ${({ isSelected, theme }) => isSelected ? theme.dark.thirdly : 'transparent'};
    color: ${({ isSelected, theme }) => isSelected ? theme.text.secondary : 'white'};
    font-weight: ${({ isRead }) => isRead ? null : '1000'};
    box-sizing: border-box;

    &:hover {
        cursor: pointer;
        background-color: ${({ isSelected, theme }) => isSelected ? null : theme.dark.secondary};
    }
`;

export const ConvName = styled.p`
    font-weight: bold;
    font-size: 1.1rem;
`

export const ProfilePicHolder = styled.div<{pic: string | undefined}>`
    min-height: 50px;
    min-width: 50px;
    border-radius: 100%;
    background-color: rgb(209, 209, 209);
    margin-right: 10px;
    background-image: url(${({pic}) => pic});
    background-size: cover;
`;

export const LastMsgBody = styled.span`
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
    white-space: pre;
    margin: 0 0 -3px 0;
`;

export const PrevCont = styled.div`
    max-width: 75%;
`

export const LastConvoPrev = styled.div`
    font-size: 1rem;
    font-weight: lighter;
`;