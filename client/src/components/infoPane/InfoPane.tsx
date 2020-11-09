import React, { useState, useEffect } from 'react';
import {useRouteMatch, useHistory} from 'react-router-dom';

import * as S from './InfoPane.styles';
import UserInfo from 'components/userInfo/UserInfo';
import {getConversationName} from 'shared/utils/helpers';
import {User} from 'shared/types/dbSchema';

import trashCan from 'images/trash_can.svg';
import videoCall from 'images/video_call.svg';
import call from 'images/call.svg';
import {deleteConversationReq} from 'api/APIUtils';
import GroupMembers from 'components/groupMembers/GroupMembers';

import {useSelector, useDispatch} from 'react-redux';
import {rootState} from 'redux/store';
import {deleteConv} from 'redux/actions/conversationsActions';

const InfoPane = () => {
    const infoPaneMatchRoute = useRouteMatch('/chat/:convId/info');
    const messagesMatchRoute = useRouteMatch<{convId: string}>('/chat/:convId');
    const currConv = useSelector((state: rootState) => state.conversations.find(conv => conv._id === messagesMatchRoute?.params.convId));
    const user = useSelector((state: rootState) => state.userInfo);
    const showInMobile = infoPaneMatchRoute ? infoPaneMatchRoute.isExact : false;
    const dispatch = useDispatch();
    const history = useHistory();
    const [members, setMembers] = useState<User[]>([]);
    let convName;
    let header;
    let profilePic;
    let bio;

    useEffect(() => {
        if (currConv?.is_group_chat && typeof currConv.members[0] !== 'string') {
            setMembers(currConv.members as User[]);
        }
    }, [currConv])

    const handleDeleteConv = () => {
        if(process.env.REACT_APP_ALLOW_DELETION === 'false') {
            alert('The creator turned off conversation deletion for now')
            return null;
        }

        if (currConv) {
            deleteConversationReq(currConv?._id, (data) => {
                dispatch(deleteConv(data.deletedConv));
                history.push('/chat');
            });
        }
    }

    const onCallClick = () => {
        alert('Feature is not yet done');
    }

    if (currConv?.is_group_chat) {
        header = currConv.group_header;
        bio = currConv.group_bio;
        if (currConv?.convHasCreated) {
            profilePic = currConv.conversation_pic.groupPic;
        }
    } else {
        if (currConv?.convHasCreated) {
            const kausap = (currConv.members as User[]).find(member => member._id !== user.userId);
            convName = getConversationName(currConv, user);
            if (typeof currConv.members[0] === 'string') {
                //members field is not populated
                header = null;
                profilePic = null;
                bio = null;
            } else {
                header = kausap?.header;
                profilePic = kausap?.profile_pic;
                bio = kausap?.bio;
            }
        } else {
            convName = currConv?.searchedUser.username;
            header = currConv?.searchedUser.header;
            profilePic = currConv?.searchedUser.profile_pic;
            bio = currConv?.searchedUser.bio;
        }
    }

    return (
        <S.StyledInfoPane showInMobile={showInMobile}>
            <S.Cont>
                <UserInfo 
                    isSetUserScreen={false}
                    convName={convName} 
                    bio={bio} 
                    header={header}
                    profilePic={profilePic} 
                    group={currConv?.is_group_chat ? {convId: currConv?._id as string} : undefined}
                />
                {currConv?.convHasCreated ? (
                    <S.ConvActionCont onClick={handleDeleteConv}>
                        <S.convActionLabel>
                            Delete conversation
                        </S.convActionLabel>
                        <S.ConvActionIcon src={trashCan} style={{height: '20px'} } />
                    </S.ConvActionCont>
                ) : (
                    null
                )}
                {currConv ? (
                    <>
                        <S.ConvActionCont onClick={onCallClick}>
                            <S.convActionLabel>
                                Video call
                            </S.convActionLabel>
                            <S.ConvActionIcon src={videoCall} />
                        </S.ConvActionCont>
                        <S.ConvActionCont onClick={onCallClick} style={{marginBottom: '25px'}}>
                            <S.convActionLabel>
                                Call
                            </S.convActionLabel>
                            <S.ConvActionIcon src={call} />
                        </S.ConvActionCont>
                        {currConv.is_group_chat ? (
                            <GroupMembers
                                isInfoPane={true}
                                members={members}
                                setMembers={setMembers}
                            />
                        ) : (
                            null
                        )}
                    </>
                ) : (
                    null
                )}
            </S.Cont>
        </S.StyledInfoPane>
    )
}

export default InfoPane;