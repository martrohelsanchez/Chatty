import React from 'react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import {mocked} from 'ts-jest';

import {renderWithProviders} from 'shared/test/test-utils';
import LogIn from './LogIn';
import { act } from '@testing-library/react';

jest.mock('axios');
const mockedAxios = mocked(axios, true);

beforeEach(() => {
    window.history.pushState({}, 'test', '/login')
});

test('Direct to /signUp when the signUp button is clicked', () => {
    const {getByTestId} = renderWithProviders(<LogIn />);

    userEvent.click(getByTestId('signUpBtn'));
    expect(window.location.pathname).toBe('/signUp');
});

describe('User tries to log in', () => {
    test('User is Authenticated', async () => {
        const {debug, getByLabelText, getByTestId} = renderWithProviders(<LogIn />);
        const usernameInput = getByLabelText(/enter your nickname/i)

        mockedAxios.post.mockResolvedValueOnce({data: {
            isAuth: true,
            csrfToken: 'testCsrfToken',
            username: 'testUsername',
            userId: 'testId'
        }})

        userEvent.type(usernameInput, 'testUsername');

        expect(usernameInput).toHaveValue("testUsername");

        await act(() => {
            userEvent.click(getByTestId('logInBtn'));
        });

        expect(window.location.pathname).toBe('/chat');
    });

    test('User is not authenticated', () => {

    })
})
