import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom'
import io from 'socket.io-client';

import styles from "./index.module.css";
import SignUp from './components/signUp/signUp';
import Chat from './components/chat/Chat';
import LogIn from './components/logIn/logIn';

export const UserContext = React.createContext(undefined);
export const socket = io('http://localhost:5000/');

function App() {
  const [userInfo, setUserInfo] = useState('');

  return (
    <UserContext.Provider value={userInfo}>
      <Router>
        <div className={styles.chatAppContainer}>
          <Switch>
            <Route exact path="/chat">
              <Chat userInfo={userInfo} setUserInfo/>
            </Route>
            <Route exact path="/signUp">
              <SignUp setUserInfo={setUserInfo}/>
            </Route>
            <Route exact path="/logIn">
              <LogIn setUserInfo={setUserInfo}/>
            </Route>
          </Switch>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;