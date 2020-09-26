// import React from 'react';
// import userEvent from '@testing-library/user-event';
// import axios from 'axios';

// import {renderWithProviders} from 'shared/test/test-utils';
// import * as API from 'api/APIUtils';
// import createConvDummyObj from 'shared/utils/createDummyDoc';
// import SearchedUser from './SearchedUser';

// import store from 'redux/store';
// import {resetConvState, retrieveConversations} from 'redux/actions/conversationsActions';
// import {Conversation_Members} from 'shared/types/dbSchema';
// import {setUserInfo} from 'redux/actions/userInfoActions';
// import { waitFor } from '@testing-library/react';

// const user = {
//     _id: 'testId',
//     username: 'testUsername'
// }

// const searchedUser = {
//     _id: 'testId3',
//     username: 'testUsername3' 
// }

// const conversation: Conversation_Members = {
//   _id: "testConvId",
//   conversation_pic: "testUrlPic",
//   created_at: Date.now(),
//   is_group_chat: false,
//   last_message: {
//     date_sent: Date.now(),
//     is_delivered: true,
//     message_body: "testMessage",
//     sender_id: "testId",
//     sender_username: "testUsername",
//   },
//   last_updated: Date.now(),
//   members: [
//     {
//       _id: user._id,
//       username: user.username
//     },
//     {
//       _id: searchedUser._id,
//       username: searchedUser.username,
//     },
//   ],
//   members_meta: [
//     {
//       user_id: "testId",
//       last_seen: Date.now(),
//       delivered: true,
//     },
//     {
//       user_id: searchedUser._id,
//       last_seen: Date.now(),
//       delivered: true,
//     },
//   ],
// };

// const mockedAxios = axios as jest.Mocked<typeof axios>;
// const _createConvDummyObj = {createConvDummyObj};

// const spyCreateConvDummyObj = jest.spyOn(_createConvDummyObj, 'createConvDummyObj');
// const spyGetConversationByMembersReq = jest.spyOn(
//   API,
//   "getConversationByMembersReq"
// );

// jest.mock('axios');

// beforeEach(() => {
//     //log user
//     store.dispatch(setUserInfo({
//         userId: user._id,
//         username: user.username
//     }));
//     //set the conversations in redux
//     store.dispatch(retrieveConversations([conversation]))
//     window.history.pushState({}, 'test', '/chat');
//     jest.resetAllMocks();
// });

// test('Correctly show the user', () => {
//     const {getByText} = renderWithProviders(
//       <SearchedUser searchedUser={searchedUser} />
//     );

//     getByText(searchedUser.username);
// });

// describe('User clicked a searched user', () => {
//     test('Conversation already exists in redux', () => {
//         const {getByText} = renderWithProviders(
//           <SearchedUser searchedUser={searchedUser} />
//         );

//         userEvent.click(getByText(searchedUser.username));
//         expect(API.getConversationByMembersReq).not.toHaveBeenCalled();

//         expect(window.location.pathname).toBe('/chat/' + conversation._id);
//     });

//     test('Conversation does not exist in redux but is on the database', async () => {
//         //Remove all conversations in redux
//         store.dispatch(resetConvState());

//         mockedAxios.get.mockResolvedValue({
//             data: {conversation: conversation}
//         });

//         const {getByText} = renderWithProviders(
//           <SearchedUser searchedUser={searchedUser} />
//         );
        
//         userEvent.click(getByText(searchedUser.username));
//         expect(spyGetConversationByMembersReq).toHaveBeenCalledTimes(1);
//         expect(spyCreateConvDummyObj).not.toHaveBeenCalled();

//         // await waitFor(() => expect(window.location.pathname).toBe('/chat/' + conversation._id));
//     });

//     test("Conversation doesn't exist in redux and in db", () => {
//         //Remove all conversations in redux
//         store.dispatch(resetConvState());

//         mockedAxios.get.mockResolvedValue({
//           data: { conversation: undefined },
//         });

//         const {getByText} = renderWithProviders(
//           <SearchedUser searchedUser={searchedUser} />
//         );
        
//         userEvent.click(getByText(searchedUser.username));
//         expect(spyGetConversationByMembersReq).toHaveBeenCalledTimes(1);
//         // expect(spyCreateConvDummyObj).toHaveBeenCalled();
//     });
// });

export {};