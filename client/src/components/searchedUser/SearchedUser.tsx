import React from 'react';
import {useHistory} from 'react-router';

import styles from './searchedUser.module.css';
import {getConversationByMembersReq} from 'api/APIUtils';
import {createConvDummyDoc} from 'shared/utils/createDummyDoc';

import {User} from 'shared/types/dbSchema';
import {rootState} from 'redux/store';
import {UserInfo} from 'redux/actions/userInfoActions';
import {useDispatch, useSelector} from 'react-redux';
import {addConv} from 'redux/actions/conversationsActions';

interface SearchedUserProps {
    searchedUser: User
}

const SearchedUser = ({searchedUser}: SearchedUserProps) => {
    const user = useSelector((state: rootState) => state.userInfo as UserInfo)
    const conversations = useSelector((state: rootState) => state.conversations);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleClick = () => {
        findConv([searchedUser._id, user.userId]);
    }

    const findConv = (members) => {
        const foundConvFromRedux = findConvInRedux(members);

        if (foundConvFromRedux !== undefined) {
            history.push(`/chat/${foundConvFromRedux._id}`);
            return null;
        }

        getConversationByMembersReq(members, data => {
            const convFromDb = data.conversation;

            if (convFromDb) {
                dispatch(addConv({
                    ...convFromDb,
                    convHasCreated: true
                }));
                history.push(`/chat/${convFromDb._id}`);
            } else {
                //If the conversation doesn't exist in DB, create a conv obj decoy
                const convObj = createConvDummyDoc([searchedUser._id, user.userId]);
                
                dispatch(addConv(convObj));
                history.push(`/chat/${convObj._id}`);
            }
        }, err => {
            console.error(err);
            //print to the user "Something went wrong, please try again later"
        });
    }

    const findConvInRedux = (targetMembers) => {
        return conversations.find(conv => 
            conv.members.every(member => targetMembers.includes(member._id))
        );
    }

    return (
      <li className={styles.container} onClick={handleClick}>
        <div className={styles.profilePicHolder}></div>
        <span data-testid="searchedUser" className={styles.username}>
          {searchedUser.username}
        </span>
      </li>
    );
}

export default SearchedUser;