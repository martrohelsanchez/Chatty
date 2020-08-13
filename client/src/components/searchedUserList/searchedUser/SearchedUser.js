import React, { useContext } from 'react';
import axios from 'axios';
import uniqid from 'uniqid';

import styles from './searchedUser.module.css';
import {UserInfoContext} from '../../../App';

import {useDispatch} from 'react-redux';
import { setCurrConv } from '../../../redux/actions/currConvActions';
import { addConv } from '../../../redux/actions/conversationsActions';

function SearchedUser({searchedUser}) {
    const user = useContext(UserInfoContext)
    const dispatch = useDispatch();

    function handleClick() {
        findConv();
    }

    async function findConv() {
        const {data} = await axios.get('/chat/conversation', {
            params: {
                members: [searchedUser._id, user.userId]
            }
        });

        if (data.conversation.length !== 0) {
            dispatch(setCurrConv(data.conversation[0]));
            return null;
        }

        const convObj = createConvObj(searchedUser);

        dispatch(addConv(convObj));
        dispatch(setCurrConv(convObj));
    }

    function createConvObj(searchedUser) {
        return {
            _id: uniqid(),
            convHasCreated: false,
            members: [
                searchedUser,
                {
                    _id: user.userId
                }
            ],
            is_chatroom: false
        }
    }

    return (
        <div className={styles.container} onClick={e => handleClick(e)}>
            <div className={styles.profilePicHolder}></div>
            <span className={styles.username}>{searchedUser.username}</span>
        </div>
    )
}

export default SearchedUser;