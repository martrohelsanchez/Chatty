import React, { useState } from 'react';
import styled from 'styled-components';

import InputBar from '../inputBar/InputBar'
import MessageList from './messages/MessageList'

import { rootState } from '../../redux/store';

import {Route, useRouteMatch} from 'react-router-dom';
import { useSelector } from 'react-redux';

const StyledMessagePane = styled.div<{showInMobile: boolean}>`
    background-color: ${({theme}) => theme.dark.secondary};
    flex: 3 1 0;
    position: relative;

    @media all and (max-width: ${({theme}) => theme.mobile}) {
        & {
            display: ${({showInMobile}) => showInMobile ? 'block' : 'none'};
        }
    }
`

const MessagePane = () => {
    const messagesMatchRoute = useRouteMatch<{convId: string}>('/chat/:convId');
    const currConv = useSelector((state: rootState) => state.conversations.find(conv => conv._id === messagesMatchRoute?.params.convId));
    const showInMobile = messagesMatchRoute ? messagesMatchRoute.isExact : false;

    return (
        <StyledMessagePane showInMobile={showInMobile}>
            <Route path='/chat/:convId'>
                {currConv ? (
                    <>
                        <MessageList currConv={currConv} />
                        <InputBar />
                    </>
                ) : (
                    null
                )}
            </Route>
        </StyledMessagePane>
    )
}

export default MessagePane;