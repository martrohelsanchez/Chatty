import React, {useState} from 'react';
import {useRouteMatch, useHistory} from 'react-router-dom';

import * as S from './ConversationPane.styles';
import Search from 'components/search/Search';
import {User} from 'shared/types/dbSchema';
import ConversationList from 'components/conversationList/ConversationList';
import SearchedUserList from 'components/searchedUserList/SearchedUserList';

import {useSelector} from 'react-redux';
import {rootState} from 'redux/store';

export interface StyledContactsPaneProps {
  readonly showInMobile: boolean;
}

const ContactsPane = () => { 
  const [isSearching, setIsSearching] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const match = useRouteMatch();
  const showInMobile = match.isExact;
  const user = useSelector((state: rootState) => state.userInfo);
  const history = useHistory();

  const directToUserProfile = () => {
    history.push(`/user/${user.userId}`);
  }  

  return (
    <S.StyledContactsPane showInMobile={showInMobile}>
      <S.UserCont onClick={directToUserProfile}>
        <S.UserProfilePic pic={user.profile_pic} />
        <S.Username>
          {user.username}
        </S.Username>
      </S.UserCont>
      <Search
        setSearchedUsers={setSearchedUsers}
        setIsSearching={setIsSearching}
      />
      {isSearching ? (
        <SearchedUserList searchedUsers={searchedUsers} />
      ) : (
        <ConversationList />
      )}
    </S.StyledContactsPane>
  );
}

export default ContactsPane;