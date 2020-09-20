import React from 'react';
import userEvent from '@testing-library/user-event'
import axios from 'axios';

import {renderWithProviders} from 'shared/test/test-utils';
import Search from './Search';

const setIsSearching = jest.fn();
const setSearchedUsers = jest.fn();
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('axios');

beforeEach(() => jest.clearAllMocks());

test('Toggle setIsSearching', () => {
    const {getByPlaceholderText, getByText} = renderWithProviders(
        <>
            <Search 
                setIsSearching={setIsSearching} 
                setSearchedUsers={setSearchedUsers} 
            />
            <div className='testElement'>Test</div>
        </>
    );

    userEvent.click(getByPlaceholderText(/search/i));
    expect(setIsSearching).toHaveBeenLastCalledWith(true);

    userEvent.click(getByText(/test/i));
    expect(setIsSearching).toHaveBeenLastCalledWith(false);
});

test('Throttle sending requests on every keystroke', async () => {
    const {getByPlaceholderText, debug} = renderWithProviders(
        <Search 
            setIsSearching={setIsSearching}
            setSearchedUsers={setSearchedUsers}
        />
    );

    mockedAxios.get.mockResolvedValue({data: {
        users: []
    }});

    await userEvent.type(getByPlaceholderText(/search/i), 'fastTyping', {delay: 100});
    expect(mockedAxios.get).not.toHaveBeenCalled();

    await userEvent.type(getByPlaceholderText(/search/i), 'slow', {delay: 800});
    expect(mockedAxios.get).toBeCalledTimes(4);
}, 10000);