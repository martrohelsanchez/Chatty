import React from 'react';
import store from 'redux/store';
import {renderWithProviders} from 'shared/test/test-utils';
import HomeRoute from './HomeRoute';
import { setUserInfo, resetUserInfo } from 'redux/actions/userInfoActions';
import { Route, match } from 'react-router-dom';
import { resetConvState } from 'redux/actions/conversationsActions';

beforeEach(() => {
    store.dispatch(resetConvState());
    store.dispatch(resetUserInfo());

    window.history.pushState({}, 'testing', '/');
})

test('Redirect to /chat if user is authenticated', () => {
    store.dispatch(setUserInfo({userId: 'testId', username: 'testUsername'}))
    let spyMatch: match<any> | undefined;
    renderWithProviders(
        <>
            <Route 
                path='*'
                render={({match}) => {
                    spyMatch = match
                    return null
                }}
            />
            <HomeRoute />
        </>
    );

    expect(spyMatch?.url).toBe('/chat')
});

test('Carry on to the route path if user is not authenticated', () => {
    let spyMatch: match<any> | undefined;
    renderWithProviders(
        <>
            <Route
                path='*'
                render={({match}) => {
                    spyMatch = match
                    return null
                }}
            />
            <HomeRoute />
        </>
    )

    expect(spyMatch?.url).toBe('/')
});