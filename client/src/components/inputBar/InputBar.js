import React, { useState, useContext } from 'react';
import axios from 'axios';

import styles from './inputBar.module.css';
import {UserInfoContext} from '../../App';
import {CurrConvContext} from '../chat/Chat';

function Input() {
  const [chatInput, setChatInput] = useState("");
  const user = useContext(UserInfoContext);
  const [currConv, setCurrConv] = useContext(CurrConvContext);

  function send(e) {
    const currConvId = currConv._id;

    if (chatInput) {
      axios.post(`/chat/conversations/${currConvId}/messages`, {
        messageBody: chatInput,
        convMembers: currConv.members
      })

      setChatInput("");
    }
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