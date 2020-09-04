import React, { useContext } from 'react';
import uniqid from 'uniqid';

import styles from './searchedUser.module.css';
import {UserInfoContext} from '../../../App';
import { getConversationByMembersReq } from '../../../api/APIUtils';

import {useDispatch, useSelector} from 'react-redux';
import { addConv } from '../../../redux/actions/conversationsActions';
import { useHistory } from 'react-router';

function SearchedUser({searchedUser}) {
    const user = useContext(UserInfoContext)
    const conversations = useSelector(state => state.conversations);
    const dispatch = useDispatch();
    const history = useHistory();

    function handleClick() {
        console.log('clicked')
        findConv([searchedUser._id, user.userId]);
    }

    function findConv(members) {
        const foundConvFromRedux = findConvInRedux(members);

        if (foundConvFromRedux !== undefined) {
            history.push(`/chat/${foundConvFromRedux._id}`);
            return null;
        }

        const foundConvFromDb = getConversationByMembersReq(members, data => {
            const convFromDb = data.conversation;
            if (convFromDb) {
                dispatch(addConv(data.conversation));
                history.push(`/chat/${convFromDb._id}`);
            } else {
                //If the conversation doesn't exist in DB, just create the conv obj decoy
                const convObj = createConvObj(searchedUser);

                dispatch(addConv(convObj));
                history.push(`/chat/${convObj._id}`);
            }
        }, err => {
            console.log(err);
            //print to the user "Something went wrong, please try again later"
        });
    }

    function findConvInRedux(targetMembers) {
        return conversations.find(conv => 
            conv.members.every(member => targetMembers.includes(member._id))
        );
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