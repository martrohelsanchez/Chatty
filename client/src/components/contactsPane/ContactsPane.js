import React, { useState } from 'react';
import styled from 'styled-components';
import { useRouteMatch } from 'react-router-dom';

import ConversationList from '../conversationList/ConversationList';
import SearchedUsers from '../searchedUserList/SearchedUserList';
import Search from '../search/Search';

const StyledContactsPane = styled.div`
    background-color: ${({theme}) => theme.dark.primary};
    flex: 1.2 1 0;

    @media all and (max-width: ${({theme}) => theme.mobile}) {
        & {
            display: ${({showInMobile}) => showInMobile ? 'block' : 'none'};
        }
    }
`;

function ContactsPane() {
    const [isSearching, setIsSearching] = useState(false);
    const [searchedUsers, setSearchedUsers] = useState([]);
    const match = useRouteMatch();
    const showInMobile = match.isExact;

    return (
        <StyledContactsPane showInMobile={showInMobile}>
            <Search setSearchedUsers={setSearchedUsers} setIsSearching={setIsSearching} />
            {isSearching ? (
                <SearchedUsers searchedUsers={searchedUsers} />
            ) : (
                <ConversationList/>
            )}
        </StyledContactsPane>
    )
}

export default ContactsPane;