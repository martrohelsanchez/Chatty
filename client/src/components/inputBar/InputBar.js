import React from 'react';

import styles from './inputBar.module.css'

function Input() {
    return (
        <div className={styles.inputContainer}>
            <input
                className={styles.input} 
                type="text" 
                placeholder="Type a message"
            />
            <button className={styles.sendBtn}>Send</button>
        </div>
    )
}

export default Input;