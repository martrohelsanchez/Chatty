import styled from 'styled-components';

export const StyledInfoPane = styled.div<{ showInMobile: boolean }>`
    background-color: ${({ theme }) => theme.dark.primary};
    flex: 0 1 33.33%;
    max-width: 420px;
    position: relative;

    @media all and (max-width: ${({ theme }) => theme.mobile}) {
        & {
            display: ${({ showInMobile }) => showInMobile ? 'block' : 'none'};
            max-width: 100%;
            flex: 1 1 25%;
        }
    }
`

export const ConvActionIcon = styled.img`
    height: 15px;
`;

export const convActionLabel = styled.span`
    font-weight: lighter;
    font-size: 1.2rem;
`;

export const ConvActionCont = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 6px 10px;
    max-width: 90%;
    box-sizing: border-box;
    margin: 0 auto 0 auto;
    border-radius: 5px;

    &:hover {
        background-color: ${({theme}) => theme.dark.secondary};
        cursor: pointer;
    }
`;