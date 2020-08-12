import React, { useState } from 'react';
import {Switch, Route, useHistory} from 'react-router-dom';

import styles from "./contactsPane.module.css";
import searchIcon from "../../images/search-icon.svg";
import ConversationList from '../conversationList/ConversationList';
import SearchedUsers from '../searchedUserList/SearchedUserList';
import Search from '../search/Search';

function ContactsPane() {
    const [isSearching, setIsSearching] = useState(false);
    const [searchedUsers, setSearchedUsers] = useState([]);

    return (
        <div className={styles.contactsPaneContainer}>
            <Search setSearchedUsers={setSearchedUsers} setIsSearching={setIsSearching} />
            {isSearching ? <SearchedUsers searchedUsers={searchedUsers} /> : <ConversationList/>}
        </div>
    )
}

export default ContactsPane;