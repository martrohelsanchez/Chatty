import React from 'react';

import AppRoute from "./AppRoute";
import {renderWithProviders} from 'shared/test/test-utils';
import server from "shared/test/handlers";

beforeAll(() => server.listen())
beforeEach(() => localStorage.clear())
afterEach(() => server.resetHandlers())
afterAll(() => server.close());

test('show splash screen when trying to authenticate', () => {
    localStorage.setItem('csrfToken', 'secretCsrfToken');
    const {getByText} = renderWithProviders(<AppRoute />);
    

    getByText('Loading...')
}, 0);

test('Prevent user from accessing /chat if not authenticated', () => {
    window.history.pushState({}, 'test', '/chat')
    renderWithProviders(
        <AppRoute />
    );

    const pathArr = window.location.pathname.split('/');

    expect(pathArr).not.toContain('chat');
}, 0);

