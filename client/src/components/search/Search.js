import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import searchIcon from '../../images/search-icon.svg';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';

function Search({setSearchedUsers, setIsSearching}) {
    const [searchInput, setSearchInput] = useState('');
    const history = useHistory();
    let searchInputTimeout;

    useEffect(() => {
        document.addEventListener('click', handleSearchClose);
        return () => {
            document.removeEventListener('click', handleSearchClose);
        }
    }, []);

    function handleSearchClose(e) {
        let fromSearch;

        for (let className of e.target.classList) {
            if (className === 'search-input') {
                fromSearch = true;
                break;
            } else {
                fromSearch = false;
            }
        }

        if (fromSearch) {
            return null;
        }
        setSearchInput(''); //reset the search input field
        setIsSearching(false);
    }

    //when user focuses on the search input
    function handleSearchFocus(e) {
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
        <>
            {/* <StyledSearch className={styles.searchContainer}> */}
                {/* <img className={styles.searchIcon} src={searchIcon} /> */}
                <StyledSearch
                    type='input'
                    className='search-input'
                    placeholder='     Search'
                    value={searchInput}
                    onChange={handleSearchInput}
                    onFocus={handleSearchFocus}
                />
            {/* </StyledSearch> */}
        </>
    )
}

const StyledSearch = styled.input`
    display: block;
    background-color: ${({theme}) => theme.dark.secondary};
    border-radius: 20px;
    width: 90%;
    height: 40px;
    margin: 50px auto;
    /* display: flex;
    justify-items: center;  */
    border: none;
    color: white;

    &:focus {
        outline: none;
    }
`;

export default Search;