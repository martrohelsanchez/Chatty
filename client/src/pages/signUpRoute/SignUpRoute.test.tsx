import ChatRoute from 'pages/chatRoute/ChatRoute';
import React from 'react';
import { Route } from 'react-router-dom';

import { resetConvState } from 'redux/actions/conversationsActions';
import { resetUserInfo, setUserInfo } from 'redux/actions/userInfoActions';
import store from 'redux/store';
import { renderWithProviders } from 'shared/test/test-utils';
import SignUpRoute from './SignUpRoute';

beforeEach(() => {
    store.dispatch(resetUserInfo());
    store.dispatch(resetConvState());

    window.history.pushState({}, 'test', '/signUp')
});

describe('Redirect', () => {
    test('Prevent user from accessing /signUp if authenticated. Redirect to /chat', () => {
        store.dispatch(setUserInfo({userId: 'testId', username: 'testUsername'}))
        
        renderWithProviders(
            <>
                <Route path='/chat' component={ChatRoute} />
                <SignUpRoute />
            </>
        );

        expect(window.location.pathname).toBe('/chat');
    });

    test('Continue to the route (/signUp) if not authenticated', () => {
        renderWithProviders(<SignUpRoute />)

        expect(window.location.pathname).toBe('/signUp');
    })
})