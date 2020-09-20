import React, {useState} from 'react';
import styled from 'styled-components';
import {useRouteMatch} from 'react-router-dom';

import ConversationList from 'components/conversationList/ConversationList';
import SearchedUserList from 'components/searchedUserList/SearchedUserList';
import Search from 'components/search/Search';
import {User} from 'shared/types/dbSchema';

interface StyledContactsPaneProps {
  readonly showInMobile: boolean;
}

const StyledContactsPane = styled.div<StyledContactsPaneProps>`
    background-color: ${({theme}) => theme.dark.primary};
    flex: 1.2 1 0;

    @media all and (max-width: ${({theme}) => theme.mobile}) {
        & {
            display: ${({showInMobile}) => showInMobile ? 'block' : 'none'};
        }
    }
`;

const ContactsPane = () => { 
  const [isSearching, setIsSearching] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const match = useRouteMatch();
  const showInMobile = match.isExact;

  return (
    <StyledContactsPane showInMobile={showInMobile}>
      <Search
        setSearchedUsers={setSearchedUsers}
        setIsSearching={setIsSearching}
      />
      {isSearching ? (
        <SearchedUserList searchedUsers={searchedUsers} />
      ) : (
        <ConversationList />
      )}
    </StyledContactsPane>
  );
}

export default ContactsPane;