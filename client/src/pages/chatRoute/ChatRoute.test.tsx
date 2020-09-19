import React from 'react';

import ChatRoute from "./ChatRoute";
import { renderWithProviders } from 'shared/test/test-utils';
import { Route, match } from 'react-router-dom';

beforeEach(() => window.history.pushState({}, 'test', '/chat'))

test('Redirect to signUp page when userInfo is null', () => {
    window.history.pushState({}, 'test', '/chat')

    let spyMatch: match<any> | undefined;
    renderWithProviders(
        <>
            <Route path='*' render={({match}) => {
                spyMatch = match;
                return null
            }} />
            <ChatRoute />
        </>
    );

    expect(spyMatch?.url).toBe('/signUp')
});