import React, { useState } from 'react';
import styled from 'styled-components';

import InputBar from '../inputBar/InputBar'
import MessageList from './messages/MessageList'

import {Route, useRouteMatch} from 'react-router-dom';

const StyledMessagePane = styled.div`
    background-color: ${({theme}) => theme.dark.secondary};
    flex: 3 1 0;
    position: relative;

    @media all and (max-width: ${({theme}) => theme.mobile}) {
        & {
            display: ${({showInMobile}) => showInMobile ? 'block' : 'none'};
        }
    }
`

function MessagePane() {
    const [isDelivered, setIsDelivered] = useState(false);
    const messagesMatchRoute = useRouteMatch('/chat/:convId');
    const showInMobile = messagesMatchRoute ? messagesMatchRoute.isExact : false;

    return (
        <StyledMessagePane showInMobile={showInMobile}>
            <Route path='/chat/:convId'>
                <MessageList isDelivered={isDelivered} />
                <InputBar />
            </Route>
        </StyledMessagePane>
    )
}

export default MessagePane;