import React, { useState, useContext } from 'react';
import io from "socket.io-client";

import styles from './inputBar.module.css';
import {socket, UserContext} from '../../App';

function Input() {
  const [chatInput, setChatInput] = useState("");
  const user = useContext(UserContext)

  function send(e) {
    socket.emit('sendMessage', {
      from: user,
      message: chatInput
    });
    setChatInput('')
  }

  function onInputChange(e) {
      setChatInput(e.target.value);
  }

  return (
    <div className={styles.inputContainer}>
      <input
        className={styles.input}
        type="text"
        placeholder="Type a message"
        value={chatInput}
        onChange={onInputChange}
        onKeyDown={({key}) => key === 'Enter' ? send() : null }
      />
      <button className={styles.sendBtn} onClick={send}>
        Send
      </button>
    </div>
  );
}

export default Input;