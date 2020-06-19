import React, { useState } from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom'
import io from 'socket.io-client';

import styles from "./index.module.css";
import ContactsPane from './components/contactsPane';
import MessagePane from './components/messagesPane';
import SignUp from './components/signUp/signUp'

export const SocketContext = React.createContext(undefined);

const socket = io('http://localhost:5000/');

function App() {

  return (
    <SocketContext.Provider value={socket}>
      <Router>
        <div className={styles.chatAppContainer}>
          <Switch>
            <Route path="/chat">
              <ContactsPane />
              <MessagePane />
            </Route>
            <Route path="/">
                <SignUp />
            </Route>
            <Route path="/logIn"></Route>
          </Switch>
        </div>
      </Router>
    </SocketContext.Provider>
  );
}

export default App;