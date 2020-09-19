import React from 'react';
import io from 'socket.io-client';
import {ThemeProvider} from 'styled-components';
import {Reset} from 'styled-reset';
import GlobalCss from './global.css';

import './api/axios';
import AppRoute from './pages/appRoute/AppRoute';
import theme from './shared/theme';

import { useSelector } from 'react-redux';
import {rootState} from './redux/store';

export const UserInfoContext = React.createContext<rootState['userInfo']>(null!);
export const socket = io('http://localhost:5000/');

socket.on('error', err => {
  console.error(err)
})

const App = () => {
  const userInfo = useSelector((state: rootState) => state.userInfo);

  return (
    <ThemeProvider theme={theme}>
      <UserInfoContext.Provider value={userInfo}>
      <Reset />
      <GlobalCss />
      <AppRoute />
      </UserInfoContext.Provider>
    </ThemeProvider>
  );
}

export default App;