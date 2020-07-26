import React, { useState, useContext } from 'react';
import axios from 'axios';
import uniqid from 'uniqid';

import styles from './inputBar.module.css';
import {UserInfoContext} from '../../App';

import {useSelector, useDispatch} from 'react-redux';
import {addNewMsg} from '../../redux/actions/messagesActions';

function Input() {
  const currConv = useSelector(state => state.currConv);
  const [chatInput, setChatInput] = useState("");
  const user = useContext(UserInfoContext);
  const dispatch = useDispatch();

  function send(e) {
    const currConvId = currConv._id;

    if (chatInput) {
      axios.post(`/chat/conversations/${currConvId}/messages`, {
        messageBody: chatInput,
        convMembers: currConv.members
      })

      dispatch(addNewMsg(currConvId, 
        {
          _id: uniqid(),
          conversation_id: currConvId,
          sender: {
            username: user.username,
            _id: user._id
          },
          message_body: chatInput,
          is_delivered: false,
          date_sent: Date.now()
        }
      ))
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