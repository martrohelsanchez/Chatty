import React from 'react';
import io from 'socket.io-client';
import {ThemeProvider} from 'styled-components';
import {Reset} from 'styled-reset';
import GlobalCss from './global.css';

import './api/axios';
import AppRoute from './pages/appRoute/AppRoute';
import theme from './shared/theme';

export const socket = io(process.env.REACT_APP_SERVER_URL, {
  transports: ["websocket", "polling"],
});

socket.on('error', err => {
  console.error(err)
})

const App = () => {

  return (
    <ThemeProvider theme={theme}>
      <Reset />
      <GlobalCss />
      <AppRoute />
    </ThemeProvider>
  );
}

export default App;