import React from 'react';

import { renderWithProviders } from 'shared/test/test-utils';
import SignUp from "components/signUp/SignUp";
import userEvent from "@testing-library/user-event";

beforeEach(() => window.history.pushState({}, 'test', '/signUp'));

test('Direct to /logIn when user wants to log in', () => {
    const {getByTestId} = renderWithProviders(<SignUp />);

    userEvent.click(getByTestId("logInBtn"));
    expect(window.location.pathname).toBe('/logIn');
});

