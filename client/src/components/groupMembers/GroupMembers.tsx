import React, { useState } from 'react';

import * as S from './GroupMembers.styles';
import crossIcon from 'images/cross.svg';
import {User} from 'shared/types/dbSchema';
import Member from 'components/member/Member';
import Typing from 'components/typing/Typing';

interface GroupMembersProps {
    members: User[];
    setMembers: React.Dispatch<React.SetStateAction<User[]>>;
    isInfoPane: boolean;
}

const GroupMembers = ({members, setMembers, isInfoPane}: GroupMembersProps) => {
    const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const removeMember = (user: User) => {
        setMembers(
            members.filter(member => member._id !== user._id)
        );
    }

    const addAsMember = (user: User) => {
        setMembers([...members, user]);
    }

    const memberList = members.map(member => (
        <Member key={member._id} member={member} isSearchedUser={false} removeMember={removeMember} />
    ));

    const searchedUserList = searchedUsers.map(user => (
        <Member key={user._id} member={user} isSearchedUser={true} addAsMember={addAsMember} />
    ));

    return (
        <S.GroupMembers isInfoPane={isInfoPane} isSearching={isSearching}>
            <p style={{fontWeight: 'bold', fontSize: '1.3rem'}}>People</p>
            {isSearching ? (
                <>
                    <S.Search 
                        setIsSearching={setIsSearching} 
                        setSearchedUsers={setSearchedUsers} 
                        autoFocus={true}
                        setIsLoading={setIsLoading}
                    />
                    {isLoading ? (
                        <S.TypingCont>
                            <Typing forMascot={false} />
                        </S.TypingCont>
                    ) : (
                        searchedUserList
                    )}
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