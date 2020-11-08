import React from 'react';

import SearchedUser from '../searchedUser/SearchedUser';
import {User} from '../../shared/types/dbSchema';
import Typing from 'components/typing/Typing';

interface SearchedUserListProps {
    searchedUsers: User[];
    isSearching: boolean;
}

const SearchedUserList = ({searchedUsers, isSearching}: SearchedUserListProps) => {
    const renderSearchedUsers = searchedUsers.map(searchedUser => {
        return (
            <SearchedUser key={searchedUser._id} searchedUser={searchedUser} />
        )
    }) 

    return (
        <ul
            style={isSearching ? {
                width: '100%',
                height: '200px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
            } : undefined}
        >
            {isSearching ? (
                <div 
                    style={{
                        position: 'relative',
                        width: '100px',
                        height: '10px'
                    }}
                >
                    <Typing forMascot={false} />
                </div>
            ) : (
                renderSearchedUsers
            )}
        </ul>
    )
}

export default SearchedUserList;