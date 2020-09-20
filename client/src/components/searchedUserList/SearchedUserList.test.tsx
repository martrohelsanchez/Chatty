import React from 'react';

import {renderWithProviders} from 'shared/test/test-utils';
import SearchedUserList from './SearchedUserList';

const users = [
    {
        _id: 'testId1',
        username: 'TestUsername1'
    },
    {
        _id: 'testId2',
        username: 'TestUsername2'
    },
    {
        _id: 'testId3',
        username: 'TestUsername3'
    }
];

test('Correctly show all of users', () => {
    const {getAllByTestId} = renderWithProviders(
        <SearchedUserList 
            searchedUsers={users}
        />
    );

    expect(getAllByTestId("searchedUser")).toHaveLength(users.length);
    getAllByTestId("searchedUser").forEach((user, i) => {
        expect(user).toHaveTextContent(users[i].username);
    });
})