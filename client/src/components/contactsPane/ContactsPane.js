import React, { useState } from 'react';
import {Switch, Route, useHistory} from 'react-router-dom';

import styles from "./contactsPane.module.css";
import searchIcon from "../../images/search-icon.svg";
import ConversationList from '../conversationList/ConversationList';

function ContactsPane() {
    const [isSearching, setIsSearching] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [searchedUser, setSearchedUser] = useState([]);
    const [intervalId, setIntervalId] = useState(null);
    const [err, setErr] = useState(null);
    const history = useHistory();

    const renderSearchedUser = searchedUser.map(user => {
        return (
            <div>
                {user.name}
            </div>
        )
    });

    //when user leaves the search input
    function handleSearchBlur() {
        history.push('/chat')
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
        history.push('/chat/search');
        setIsSearching(true);
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
                    onChange={e => setSearchInput(e.target.value)}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                />
            </div>
            <Switch>
                <Route exact path='/chat'>
                        <ConversationList />
                </Route>
                <Route path='/chat/search' >
                    {renderSearchedUser}
                </Route>
            </Switch>
        </div>
    )
}

export default ContactsPane;