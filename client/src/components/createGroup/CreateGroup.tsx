import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import * as S from './CreateGroup.styles';
import GroupMembers from 'components/groupMembers/GroupMembers';
import nextIcon from 'images/next.svg';
import {User} from 'shared/types/dbSchema';
import { createConvDocReq } from 'api/APIUtils';
import { useSelector } from 'react-redux';
import { rootState } from 'redux/store';

const CreateGroup = () => {
    const user = useSelector((state: rootState) => state.userInfo);
    const [isLoading, setIsLoading] = useState(false);
    const [grpNameInput, setGrpNameInput] = useState('');
    const members = useRef<User[]>([]);
    const history = useHistory();
    let canProceed;

    if (members.current.length > 2 && grpNameInput) {
        canProceed = true
    } else {
        canProceed = false;
    }

    const onGrpNameinputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGrpNameInput(e.target.value);
    }

    const onNextBtnClick = async () => {
        try {
            if (canProceed) {
                setIsLoading(true);

                const membersId = [
                    ...(members.current.map(member => member._id)), 
                    user.userId
                ];
                
                await createConvDocReq(membersId, grpNameInput);
                setIsLoading(false);
                history.push('/chat');
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <S.PrussianBlueBg>
            <S.Cont>
                <S.PageName>
                    Create group
                </S.PageName>
                <S.GroupName
                    value={grpNameInput}
                    placeholder='Edit group name'
                    onChange={onGrpNameinputChange}
                />
                <GroupMembers
                    getMembers={members}
                />
                {isLoading ? (
                    <S.Loading />
                ) : (
                    <S.NextBtn 
                        canProceed={canProceed} 
                        src={nextIcon} 
                        onClick={onNextBtnClick}
                    />
                )}
            </S.Cont>
        </S.PrussianBlueBg>
    )
}

export default CreateGroup;