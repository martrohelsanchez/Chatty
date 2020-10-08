import React, {useState} from 'react';
import {useRouteMatch, useHistory} from 'react-router-dom';

import * as S from './ConversationPane.styles';
import Search from 'components/search/Search';
import {User} from 'shared/types/dbSchema';
import ConversationList from 'components/conversationList/ConversationList';
import SearchedUserList from 'components/searchedUserList/SearchedUserList';
import logOutIcon from 'images/logout.svg';
import createGrpIcon from 'images/create_group.svg';

import {useSelector, useDispatch} from 'react-redux';
import {rootState} from 'redux/store';
import {resetUserInfo} from 'redux/actions/userInfoActions';

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
  const dispatch = useDispatch();

  const directToUserProfile = () => {
    history.push(`/user/${user.userId}`);
  }
  
  const logOut = () => {
    window.localStorage.clear();
    dispatch(resetUserInfo());
    history.push('/logIn');
  }

  const directToGroupRoute = () => {
    history.push('/group');
  }

  return (
    <S.StyledContactsPane showInMobile={showInMobile}>
      <S.TopCont >
        <div style={{display: 'flex', alignItems: 'center'}}>
          <S.UserProfilePic onClick={directToUserProfile} pic={user.profile_pic} />
          <S.Username onClick={directToUserProfile}>
            {user.username}
          </S.Username>
        </div>
        <S.LogOut src={logOutIcon} onClick={logOut} />
      </S.TopCont>
      <S.SearchCont>
        <Search
          setSearchedUsers={setSearchedUsers}
          setIsSearching={setIsSearching}
          autoFocus={false}
        />
        <S.CreateGrp src={createGrpIcon} onClick={directToGroupRoute} />
      </S.SearchCont>
      {isSearching ? (
        <SearchedUserList searchedUsers={searchedUsers} />
      ) : (
        <ConversationList />
      )}
    </S.StyledContactsPane>
  );
}

export default ContactsPane;