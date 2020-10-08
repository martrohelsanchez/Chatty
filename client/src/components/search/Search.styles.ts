import styled from 'styled-components';

export const SearchIcon = styled.img`
  height: 60%;
`;

export const SearchInput = styled.input`
  flex: 1 1 auto;
  background-color: ${({ theme }) => theme.dark.secondary};
  border-radius: 40px;
  height: 35px;
  border: none;
  color: white;
  padding: 0 20px;
  box-sizing: border-box;
  font-weight: lighter;

  &:focus {
    outline: none;
  }
`;