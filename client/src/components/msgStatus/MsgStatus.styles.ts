import styled from 'styled-components';

export const Status = styled.img`
    height: 15px;
    border-radius: 10px;
    margin: 0 5px 0 0;
    background-color: ${({theme}) => theme.dark.primary}
`;

export const MsgStatusContainer = styled.div<{ isFromUser: boolean }>`
    align-self: ${({ isFromUser }) => isFromUser ? 'flex-end' : 'flex-start'};
    margin: 5px 0 0 30px;
`;