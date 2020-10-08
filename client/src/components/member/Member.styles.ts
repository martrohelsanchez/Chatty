import styled from 'styled-components';

export const MemberCont = styled.div<{isSearchedUser}>`
    display: flex;
    align-items: center;
    width: 100%;
    margin: 10px 0;

    &:hover {
        cursor: ${({isSearchedUser}) => isSearchedUser ? 'pointer' : null};
        background-color: ${({isSearchedUser, theme}) => isSearchedUser ? theme.dark.secondary : null};
    }
`;

export const MemberProfilePic = styled.img`
    width: 50px;
    height: 50px;
    margin-right: 10px;
    border-radius: 50%;
`;

export const Remove = styled.p`
    color: ${({theme}) => theme.cinnabar};

    &:hover {
        cursor: pointer;
    }
`;

export const Member = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 10px;
`;