import React, { useState } from 'react';
import {Link, useHistory} from 'react-router-dom';

import styles from './signUp.module.css';

function SignUp({setUser}) {
    const [input, setInput] = useState('');
    const history = useHistory();

    function onClick(e) {
        setInput('')
        setUser(input);
        history.push('/chat')
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
                onKeyDown={({ key }) => key === 'Enter' ? onClick() : null}
            />
                <button className={styles.signUpBtn} onClick={onClick}>
                    Sign Up
                </button>
        </div>
    )
}

export default SignUp