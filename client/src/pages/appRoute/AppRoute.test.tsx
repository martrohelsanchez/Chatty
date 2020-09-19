import React from 'react';
import {waitFor} from "@testing-library/react";

import AppRoute from "./AppRoute";
import {renderWithProviders} from 'shared/test/test-utils';
import server from "shared/test/handlers";

import store from 'redux/store';
import {resetConvState} from 'redux/actions/conversationsActions';
import {resetUserInfo} from 'redux/actions/userInfoActions';

beforeAll(() => server.listen())
beforeEach(() => {
    localStorage.clear()
    window.history.pushState({}, 'test', '/');
    store.dispatch(resetConvState());
    store.dispatch(resetUserInfo());
});
afterEach(() => server.resetHandlers())
afterAll(() => server.close());


test('Direct to /chat if user is authenticated', async () => {
    localStorage.setItem('csrfToken', 'secretCsrfToken');
    const {getByText} = renderWithProviders(<AppRoute />);
    
    getByText('Loading...')

    await waitFor(() => expect(window.location.pathname).toBe('/chat'));
});

test('Prevent user from accessing /chat if not authenticated', () => {
    window.history.pushState({}, 'test', '/chat')
    renderWithProviders(
        <AppRoute />
    );

    expect(window.location.pathname).not.toBe('/chat');
});