import React from 'react';

import * as S from './Member.styles';
import {User} from 'shared/types/dbSchema';

interface MemberProps {
    member: User;
    isSearchedUser: boolean;
    addAsMember?: (user: User) => void;
    removeMember?: (user: User) => void;
}

const Member = ({member, isSearchedUser, addAsMember, removeMember}: MemberProps) => {

    const onUserClick = () => {
        if (isSearchedUser && addAsMember) {
            addAsMember(member);
        }
    }

    const onRemoveMember = () => {
        if (!isSearchedUser && removeMember) {
            removeMember(member);
        }
    }

    return (
        <S.Member>
            <S.MemberCont isSearchedUser={isSearchedUser} onClick={onUserClick}>
                <S.MemberProfilePic src={member.profile_pic} />
                <p style={{display: 'inline-block'}}>{member.username}</p>
            </S.MemberCont>
            {isSearchedUser ? (
                null
            ) : (
                <S.Remove onClick={onRemoveMember}>
                    Remove
                </S.Remove>
            )}
        </S.Member>
    )
};

export default Member;