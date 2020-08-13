import React from 'react';

import styles from './searchedUser.module.css';
import SearchedUser from './searchedUser/SearchedUser';

function SearchedUserList({searchedUsers}) {

    const renderSearchedUsers = searchedUsers.map(searchedUser => {
        return (
            <SearchedUser searchedUser={searchedUser} />
        )
    })

    return (
        <div>
            {renderSearchedUsers}
        </div>
    )
}

export default SearchedUserList;