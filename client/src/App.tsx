import React from 'react';
import io from 'socket.io-client';
import {ThemeProvider} from 'styled-components';
import {Reset} from 'styled-reset';
import GlobalCss from './global.css';

import './api/axios';
import styles from "./index.module.css";
import AppRoute from './pages/AppRoute';
import theme from './theme/theme';

import { useSelector } from 'react-redux';

export const UserInfoContext = React.createContext(null);
export const socket = io('http://localhost:5000/');

socket.on('error', err => {
  console.error(err)
})

function App() {
  const userInfo = useSelector(state => state.userInfo); //Refractor

  return (
    <ThemeProvider theme={theme}>
      <UserInfoContext.Provider value={userInfo}>
        <Reset />
        <GlobalCss />
        <div className={styles.chatAppContainer}>
          <AppRoute />
        </div>
      </UserInfoContext.Provider>
    </ThemeProvider>
  );
}

export default App;