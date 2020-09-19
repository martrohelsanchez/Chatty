import React from 'react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import {mocked} from 'ts-jest/utils';
import {waitFor, fireEvent} from '@testing-library/react'

import {renderWithProviders} from 'shared/test/test-utils';
import LogIn from './LogIn';
import * as actions from 'redux/actions/userInfoActions';

jest.mock('axios');

const mockedAxios = mocked(axios, true);
const spySetUserInfo = jest.spyOn(actions, 'setUserInfo');

beforeEach(() => {
    window.history.pushState({}, 'test', '/login')
});

test('Direct to /signUp when the signUp button is clicked', () => {
    const {getByTestId} = renderWithProviders(<LogIn />);

    userEvent.click(getByTestId('signUpBtn'));
    expect(window.location.pathname).toBe('/signUp');
});

describe('User tries to log in', () => {
    describe('User is Authenticated', () => {
        test.each([
            'pressing Enter',
            'clicking Log In'
        ])('Logging user by %s', async (by) => {
            const {getByLabelText, getByTestId} = renderWithProviders(<LogIn />);

            mockedAxios.post.mockResolvedValue({data: {
                isAuth: true,
                csrfToken: 'testCsrfToken',
                username: 'testUsername',
                userId: 'testId'
            }})

            userEvent.type(getByLabelText(/enter your nickname/i), 'testUsername');
            
            if (by === 'pressing Enter') {
                fireEvent.keyDown(getByLabelText(/enter your nickname/i), {key: 'Enter'});
            }

            if (by === 'clicking Log In') {
                userEvent.click(getByTestId('logInBtn'));
            }

            expect(mockedAxios.post).toHaveBeenCalled();

            await waitFor(() => expect(spySetUserInfo).toHaveBeenCalled());
            await waitFor(() => expect(window.location.pathname).toBe('/chat'));
        })
    });

    test('User is not authenticated', async () => {
        const responseErr = new Error();
        responseErr['response'] = {status: 401};
        mockedAxios.post.mockRejectedValue(responseErr);

        const {getByLabelText, getByTestId, getByText} = renderWithProviders(<LogIn />);

        userEvent.type(getByLabelText(/enter your nickname/i), "testUsername");
        userEvent.click(getByTestId("logInBtn"));

        await waitFor(() => getByText(/Wrong nickname or password/i));
    })
})
