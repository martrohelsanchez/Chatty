import styled from 'styled-components';
import {StyledContactsPaneProps} from './ConversationPane';

export const StyledContactsPane = styled.div<StyledContactsPaneProps>`
    background-color: ${({ theme }) => theme.dark.primary};
    flex: 0 1 25%;
    max-width: 420px;
    min-width: 0;

    @media all and (max-width: ${({ theme }) => theme.mobile}) {
        & {
            display: ${({ showInMobile }) => showInMobile ? 'block' : 'none'};
            max-width: 100%;
            flex: 1 1 25%;
        }
    }
`;

export const UserProfilePic = styled.span<{pic?: string}>`
    display: inline-block;
    background-color: ${({theme}) => theme.dark.secondary};
    background-image: url(${({pic}) => pic});
    background-size: cover;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    border: none;
    margin: 0 8px 0 0;

    &:hover {
        cursor: pointer;
    }
`;

export const Username = styled.p`
    display: inline-block;
    font-weight: lighter;

    &:hover {
        cursor: pointer;
    }
`;

export const TopCont = styled.span`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px;
    width: 90%;
    box-sizing: border-box;
`;

export const LogOut = styled.img`
    height: 35px;
    
    &:hover {
        cursor: pointer;
    }
`;

export const SearchCont = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 50px auto;
  width: 90%;
`;

export const CreateGrp = styled.img`
  height: 35px;

  &:hover {
    cursor: pointer;
  }
`;