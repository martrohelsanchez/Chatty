import React, { useState } from 'react';
import {Link, useHistory} from 'react-router-dom';
import axios from 'axios';

import styles from './signUp.module.css';

function SignUp({setUser}) {
    const [input, setInput] = useState('');
    const [err, setErr] = useState(null);
    const history = useHistory();

    function signUp(e) {
        axios.post('http://localhost:5000/signUp', {
            username: input
        })
            .then(({data}) => {
                if (! data.isUsernameTaken) {
                    setInput('')
                    setUser(data);
                    history.push('/chat')
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

    return (
        <div className={styles.signUpContainer}>
            <h3 className={styles.promptNickname}>What's your nickname?</h3>
            <input 
                className={styles.nicknameInput} 
                type="input"
                value={input}
                onChange={onInputChange}
                onKeyDown={({ key }) => key === 'Enter' ? signUp() : null}
            />
            {<div className={styles.userTaken}>{err}</div>}
            <button className={styles.signUpBtn} onClick={signUp}>
                Sign Up
            </button>
        </div>
    )
}

export default SignUp