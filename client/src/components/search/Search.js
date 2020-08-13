import React, { useState, useEffect } from 'react';

import styles from './search.module.css';
import searchIcon from '../../images/search-icon.svg';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';

function Search({setSearchedUsers, setIsSearching}) {
    const [searchInput, setSearchInput] = useState('');
    const history = useHistory();
    let searchInputTimeout;

    useEffect(() => {
        document.addEventListener('click', handleSearchClose);
    }, []);

    function handleSearchClose(e) {
        if (e.target.className === styles.searchInput) {
            return null;
        }
        // history.push('/chat')
        setSearchInput(''); //reset the search input field
        setIsSearching(false);
    }

    //when user focuses on the search input
    function handleSearchFocus(e) {
        history.push('/chat/search');
        setIsSearching(true);
    }

    function handleSearchInput({target}) {
        clearTimeout(searchInputTimeout);
        searchInputTimeout = setTimeout( async () => {
            const {data} = await Axios.get('/chat/search', {
                params: {
                    searchInput: target.value
                }
            });

            setSearchedUsers(data.users);
        }, 300);

        setSearchInput(target.value);
    }

    return (
        <div className={styles.searchContainer}>
            <img className={styles.searchIcon} src={searchIcon} />
            <input
                type='input'
                className={styles.searchInput}
                placeholder='Search'
                value={searchInput}
                onChange={handleSearchInput}
                onFocus={handleSearchFocus}
            />
        </div>
    )
}

export default Search;