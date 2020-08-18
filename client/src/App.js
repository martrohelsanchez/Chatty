import React, {useState} from 'react';
import {Switch, Route} from 'react-router-dom'
import io from 'socket.io-client';
import axios from 'axios';

import styles from "./index.module.css";
import SignUp from './components/signUp/signUp';
import Chat from './components/chat/Chat';
import LogIn from './components/logIn/logIn';

export const UserInfoContext = React.createContext(null);
export const socket = io('http://localhost:5000/');

socket.on('error', err => {
  console.err(err)
})

axios.interceptors.request.use((config) => {
  config.baseURL = 'http://localhost:5000';
  config.headers['csrf-token'] = window.localStorage.getItem('csrfToken');
  config.withCredentials = true;

  return config;
}, (err) => {
  console.error(err);
  return Promise.reject(err);
})

function App() {
  const [userInfo, setUserInfo] = useState(null);

  return (
      <UserInfoContext.Provider value={userInfo}>
        <div className={styles.chatAppContainer}>
          <Switch>
            <Route path="/chat">
              <Chat />
            </Route>
            <Route exact path="/signUp">
              <SignUp setUserInfo={setUserInfo}/>
            </Route>
            <Route exact path="/logIn">
              <LogIn setUserInfo={setUserInfo}/>
            </Route>
          </Switch>
        </div>
    </UserInfoContext.Provider>
  );
}

export default App;