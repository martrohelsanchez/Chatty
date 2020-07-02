import React, { useState } from 'react';

import styles from "./contactsPane.module.css";
import searchIcon from "../../images/search-icon.svg";

function ContactsPane({userInfo}) {
    const [isSearching, setIsSearching] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [searchedUser, setSearchedUser] = useState([]);
    const [intervalId, setIntervalId] = useState(null);
    const [err, setErr] = useState(null);
    const {conversations} = userInfo;

    console.log(searchInput)
    
    const renderAllConvo = conversations.map(convo => {
        return (
            <div>
                <div>
                    <b>
                        {convo.kausap}:
                    </b>
                    <span>
                        {convo.from}
                    </span>
                    <span>
                        {convo.message}
                    </span>
                </div>
            </div>
        )
    });

    const renderSearchedUser = searchedUser.map(user => {
        return (
            <div>
                {user.name}
            </div>
        )
    });

    //when user leaves the search input
    function handleSearchBlur() {
        clearInterval(intervalId);
        setSearchInput(''); //reset the search input field
        setIsSearching(false);
    }

    //when user focuses on the search input
    function handleSearchFocus() {
        //sets intervalId state to the returned ID of setInterval
        // setIntervalId(
        //     setInterval(() => {
        //         console.log(searchInput)
        //         axios.post('http://localhost:5000/chat/search', {
        //             searchInput: searchInput
        //         })
        //             .then(res => {
        //                 console.log(res.data.users)
        //                 setSearchedUser(res.data.users);
        //             })
        //             .catch(res => {
        //                 setErr('Something went wrong. Please try again later');
        //             })
        //     }, 500)
        // )
        setIsSearching(true);
    }

    function searchInputChange({target}) {
        setSearchInput(target.value);
    }

    return (
        <div className={styles.contactsPaneContainer}>
            <div className={styles.searchContainer}>
                <img className={styles.searchIcon} src={searchIcon} />
                <input
                    type='input'
                    className={styles.searchInput}
                    placeholder='Search'
                    value={searchInput}
                    onChange={searchInputChange}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                />
            </div>
            {/* {
                isSearching ? 
                    { renderSearchedUser}
                :
                    {renderAllConvo}
            } */}
        </div>
    )
}
 
export default ContactsPane;