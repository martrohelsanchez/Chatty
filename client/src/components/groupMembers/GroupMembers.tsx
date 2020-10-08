import React, { useState } from 'react';

import * as S from './GroupMembers.styles';
import crossIcon from 'images/cross.svg';
import {User} from 'shared/types/dbSchema';
import Member from 'components/member/Member';

interface GroupMembersProps {
    getMembers?: React.MutableRefObject<User[]>;
}

const GroupMembers = ({getMembers}: GroupMembersProps) => {
    const [members, setMembers] = useState<User[]>([]);
    const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    if (getMembers) {
        getMembers.current = members;
    }

    const removeMember = (user: User) => {
        setMembers(
            members.filter(member => member._id !== user._id)
        );
    }

    const addAsMember = (user: User) => {
        setMembers([...members, user]);
    }

    const memberList = members.map(member => (
        <Member member={member} isSearchedUser={false} removeMember={removeMember} />
    ));

    const searchedUserList = searchedUsers.map(user => (
        <Member member={user} isSearchedUser={true} addAsMember={addAsMember} />
    ));

    return (
        <S.GroupMembers isSearching={isSearching}>
            <p style={{fontWeight: 'bold', fontSize: '1.3rem'}}>People</p>
            {isSearching ? (
                <>
                    <S.Search 
                        setIsSearching={setIsSearching} 
                        setSearchedUsers={setSearchedUsers} 
                        autoFocus={true}
                    />
                    {searchedUserList}
                </>
            ) : (
                <>
                    <S.AddPplCont onClick={e => setIsSearching(true)}>
                        <S.Cross src={crossIcon} />
                        <p style={{display: 'inline-block', marginLeft: '10px'}}>Add People</p>
                    </S.AddPplCont>
                    {memberList}
                </>
            )}
        </S.GroupMembers>
    )
}

export default GroupMembers;