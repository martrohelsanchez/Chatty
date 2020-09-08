import React from 'react';

import SearchedUser from './searchedUser/SearchedUser';
import {User} from '../../shared/types/dbSchema';

interface SearchedUserListProps {
    searchedUsers: User[];
}

const SearchedUserList = ({searchedUsers}: SearchedUserListProps) => {

    const renderSearchedUsers = searchedUsers.map(searchedUser => {
        return (
            <SearchedUser key={searchedUser._id} searchedUser={searchedUser} />
        )
    }) 

    return (
        <div>
            {renderSearchedUsers}
        </div>
    )
}

export default SearchedUserList;