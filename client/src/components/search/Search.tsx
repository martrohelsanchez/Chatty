import React, { useState, useEffect, useRef } from 'react';

import * as S from './Search.styles';
import axios from 'axios';
import {User} from 'shared/types/dbSchema';

interface SearchProps {
  setSearchedUsers: React.Dispatch<React.SetStateAction<User[]>>;
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
  autoFocus?: boolean;
  className?: string;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface MouseEventListerner {
    (this: Document, ev: MouseEvent): void;
};

const Search = ({setSearchedUsers, setIsSearching, autoFocus, className, setIsLoading}: SearchProps) => {
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
      // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const setLoading = (bool: boolean) => {
      if (setIsLoading) setIsLoading(bool);
    }

    const handleSearchInput = ({target}: React.ChangeEvent<HTMLInputElement>) => {
        clearTimeout(searchInputTimeout.current);
        searchInputTimeout.current = setTimeout( async () => {
          if (target.value) {
            setLoading(true);

            const {data} = await axios.get<{users: User[]}>('/chat/search', {
                params: {
                    searchInput: target.value
                }
            });

            setLoading(false);
            setSearchedUsers(data.users);
          }
        }, 700);

        setSearchInput(target.value);
    }

    return (
      <>
        <S.SearchInput
          type="text"
          className={`search-input ${className}`}
          placeholder="Search"
          value={searchInput}
          onChange={handleSearchInput}
          onFocus={handleSearchFocus}
          autoFocus={autoFocus}
        />
      </>
    );
}

export default Search;