import React, { useEffect } from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom'
import io from 'socket.io-client';

import styles from "./index.module.css";
import ContactsPane from './components/contactsPane';
import MessagePane from './components/messagesPane';
import SignUp from './components/signUp/signUp'

function App() {
  useEffect(() => {
    const socket = io('http://localhost:5000/');
  })

  return (
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
  );
}

export default App;