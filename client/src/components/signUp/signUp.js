import React, { useState } from 'react';
import {Link} from 'react-router-dom';

import styles from './signUp.module.css';

function SignUp({setUser}) {
    const [input, setInput] = useState('');

    function onClick(e) {
        setInput('')
        setUser(input);
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
            />
                <button className={styles.signUpBtn} onClick={onClick}>
                    <Link to='/chat' onClick={e => input == '' ? e.preventDefault() : null}>
                        Sign Up
                    </Link>
                </button>
        </div>
    )
}

export default SignUp