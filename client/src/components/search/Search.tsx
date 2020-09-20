import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import searchIcon from 'images/search-icon.svg';
import axios from 'axios';
import {User} from 'shared/types/dbSchema';

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
        }, 700);

        setSearchInput(target.value);
    }

    return (
      <>
        <StyledSearch>
          {/* <SearchIcon src={searchIcon} /> */}
          <SearchInput
            as="input"
            type="input"
            className="search-input"
            placeholder="Search"
            value={searchInput}
            onChange={handleSearchInput}
            onFocus={handleSearchFocus}
          />
        </StyledSearch>
      </>
    );
}

const StyledSearch = styled.div`
  display: block;
  background-color: ${({theme}) => theme.dark.secondary};
  border-radius: 40px;
  width: 90%;
  height: 40px;
  margin: 50px auto;
  border: none;
  color: white;
`;

const SearchIcon = styled.img`
  height: 60%;
`;

const SearchInput = styled(StyledSearch)`
  width: 85%;

  &:focus {
    outline: none;
  }
`;

export default Search;