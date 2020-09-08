import React, { useContext } from 'react';
import styled from 'styled-components';
import { useHistory, useRouteMatch } from 'react-router-dom';

import {UserInfoContext} from '../../App';

import { rootState } from '../../redux/store';

interface ConversationProps {
    conv: rootState['conversations'][0]
}

function Conversation({conv}: ConversationProps) {               
    const user = useContext(UserInfoContext);
    const history = useHistory();
    const match = useRouteMatch<{convId: string}>('/chat/:convId');
    const currConvId = match ? match.params.convId : '';
    
    /* When the user clicked a user from search, the conversation is added in
    the redux state. Don't show the conversation if it doesn't exists yet in the DB */
    if (conv.convHasCreated === false) return null;

    const {last_message, is_group_chat, group_name, members, members_meta} = conv;
    const isRead = (members_meta.find(member => member.user_id === user.userId) as typeof members_meta[0])?.last_seen >= last_message.date_sent;
    const isSelected = currConvId === conv._id ? true : false;
    let conversationName;


    if (is_group_chat) {
        conversationName = group_name;
    } else {
        conversationName = members.find(member => member._id !== user.userId)?.username;
    }

    function handleOpenConvo() {
        history.push(`/chat/${conv._id}`);
    }
 
    return (
        <StyledConversation isRead={isRead} isSelected={isSelected} onClick={handleOpenConvo}>
            <ProfilePicHolder></ProfilePicHolder>
            <div>
                <ConvName>
                    {conversationName}
                </ConvName>
                <LastConvoPrev>
                    <span>
                        {last_message.sender_username}:{' '}
                    </span>
                    <span>
                        {last_message.message_body}
                    </span>
                </LastConvoPrev>
            </div>
        </StyledConversation>
    ) 
}

const StyledConversation = styled.div<{isRead: boolean, isSelected: boolean}>`
    display: flex;
    align-items: center;
    width: 100%;
    padding: .5rem;
    background-color: ${({isSelected, theme}) => isSelected ? theme.dark.thirdly : 'transparent'};
    color: ${({isSelected, theme}) => isSelected ? theme.text.secondary : 'white'};
    font-weight: ${({isRead}) => isRead ? null : '600'};

    &:hover {
        cursor: pointer;
        background-color: ${({isSelected, theme}) => isSelected ? null : theme.dark.secondary};
    }
`;

const ConvName = styled.p`
    font-weight: bold;
    font-size: 1.1rem;
`

const LastConvoPrev = styled.div`
    font-size: 1rem;
`;

const ProfilePicHolder = styled.div`
    height: 50px;
    width: 50px;
    border-radius: 100%;
    background-color: rgb(209, 209, 209);
    margin-right: 10px;
`;

export default Conversation