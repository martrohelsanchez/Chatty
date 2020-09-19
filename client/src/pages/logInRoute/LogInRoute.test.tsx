import React from 'react';

import { renderWithProviders } from 'shared/test/test-utils';
import store from '../../redux/store';
import {resetUserInfo, setUserInfo} from "../../redux/actions/userInfoActions";
import {resetConvState} from "../../redux/actions/conversationsActions";
import LogInRoute from './LogInRoute';
import { Route } from 'react-router-dom';
import ChatRoute from 'pages/chatRoute/ChatRoute';

beforeEach(() => {
    store.dispatch(resetUserInfo());
    store.dispatch(resetConvState());

    window.history.pushState({}, 'test', '/login')
});

describe('Redirect', () => {
    test('Continue to the route (/logIn) if not authenticated', () => {
        renderWithProviders(<LogInRoute />)

        expect(window.location.pathname).toBe('/login');
    });

    test('Prevent user from accessing login if authenticated. Redirect to /chat', () => {
        store.dispatch(setUserInfo({userId: 'testId', username: 'testUsername'}))

        renderWithProviders(
            <>
                <Route path='/chat' component={ChatRoute} />
                <LogInRoute />
            </>
        );

        expect(window.location.pathname).toBe('/chat');
    });
});