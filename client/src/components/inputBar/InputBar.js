import React, { useState, useEffect, useContext } from 'react';
import io from "socket.io-client";

import styles from './inputBar.module.css';
import {SocketContext} from '../../App';

function Input() {
  const [chatInput, setChatInput] = useState("");
  const socket = useContext(SocketContext);

  function onSend(e) {
      socket.emit('sendMessage', chatInput);
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
      />
      <div>
          {chatInput}
      </div>
      <button className={styles.sendBtn} onClick={onSend}>
        Send
      </button>
    </div>
  );
}

export default Input;