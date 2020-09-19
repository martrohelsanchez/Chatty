import React, { useState } from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';

import styles from './signUp.module.css';

function SignUp() {
    const [input, setInput] = useState<string>('');
    const [err, setErr] = useState<string | null>(null);
    const history = useHistory();

    function signUp() {
        axios.post('/user/signUp', {
            username: input.trim()
        })
            .then(({data}) => {
                if (! data.isUsernameTaken) {
                    setInput('')
                    history.push('/logIn')
                } else {
                    setErr('User already exists')
                }
            })
            .catch(err => {
                setErr('Sorry, something went wrong. Please try again later')
            })
        setErr(null)
    }

    function onInputChange(e) {
        setInput(e.target.value);
    }

    function directToLogIn() {
        history.push('/logIn')
    }

    return (
      <div className={styles.signUpContainer}>
        <h3 className={styles.promptNickname}>What's your nickname?</h3>
        <input
          className={styles.nicknameInput}
          type="input"
          value={input}
          onChange={onInputChange}
          onKeyDown={({ key }) => (key === 'Enter' ? signUp() : null)}
        />
        {<div className={styles.userTaken}>{err}</div>}
        <button className={styles.signUpBtn} onClick={signUp}>
          Sign Up
        </button>
        <br />
        <p style={{ textAlign: "center" }}>Already have an account?</p>
        <button
          data-testid='logInBtn'
          className={styles.logInBtn}
          onClick={directToLogIn}
        >
          Log In
        </button>
      </div>
    );
}

export default SignUp