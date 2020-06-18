import React from 'react';

import styles from './signUp.module.css';

function SignUp() {
    return (
        <div className={styles.signUpContainer}>
            <h3 className={styles.promptNickname}>What's your nickname?</h3>
            <input 
                className={styles.nicknameInput} 
                type="input"
            />
            <button className={styles.signUpBtn}>
                Sign Up
            </button>
        </div>
    )
}

export default SignUp