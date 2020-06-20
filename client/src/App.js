import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom'
import io from 'socket.io-client';

import styles from "./index.module.css";
import ContactsPane from './components/contactsPane';
import MessagePane from './components/messagesPane';
import SignUp from './components/signUp/signUp';

export const UserContext = React.createContext(undefined);
export const socket = io('http://localhost:5000/');

function App() {
  const [user, setUser] = useState('');

  return (
    <UserContext.Provider value={user}>
      <Router>
        <div className={styles.chatAppContainer}>
          <Switch>
            <Route path="/chat">
              <ContactsPane />
              <MessagePane />
            </Route>
            <Route path="/">
                <SignUp setUser={setUser}/>
            </Route>
            <Route path="/logIn"></Route>
          </Switch>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;