import styled from 'styled-components';

export const msgInputBar = styled.input`
    display: block;
    border: none;
    border-radius: 15px;
    min-height: 40px;
    background-color: ${({theme}) => theme.dark.primary};
    padding: 0 20px;
    box-sizing: border-box;
    width: 95%;
    margin: 0 auto;
    color: white;
    margin: 0 auto 20px auto;

    &:focus {
        outline: none;
    }
`;