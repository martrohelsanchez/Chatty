import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import searchIcon from '../../images/search-icon.svg';
import axios from 'axios';
import { User } from '../../shared/types/dbSchema';

interface SearchProps {
  setSearchedUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
}

interface MouseEventListerner {
    (this: Document, ev: MouseEvent): void;
};

const Search = ({setSearchedUsers, setIsSearching}: SearchProps) => {
    const [searchInput, setSearchInput] = useState('');
    const searchInputTimeout = useRef<number | undefined>(undefined);

    useEffect(() => {
        document.addEventListener(
          "click",
          handleSearchClose as MouseEventListerner
        );
        return () => {
            document.removeEventListener(
              "click",
              handleSearchClose as MouseEventListerner
            );
        }
    }, []);

    const handleSearchClose = (e: MouseEvent & {target: HTMLInputElement}) => {
      let fromSearch;

      for (let className of e.target.classList) {
        if (className === "search-input") {
          fromSearch = true;
          break;
        } else {
          fromSearch = false;
        }
      }

      if (fromSearch) {
        return null;
      }
      setSearchInput(""); //reset the search input field
      setIsSearching(false);
    };

    //when user focuses on the search input
    const handleSearchFocus = () => {
      setIsSearching(true);
    };

    const handleSearchInput = ({target}: React.ChangeEvent<HTMLInputElement>) => {
        clearTimeout(searchInputTimeout.current);
        searchInputTimeout.current = setTimeout( async () => {
            const {data} = await axios.get<{users: User[]}>('/chat/search', {
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