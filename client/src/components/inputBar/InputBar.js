import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import uniqid from 'uniqid';

import styles from './inputBar.module.css';
import {UserInfoContext} from '../../App';

import {useSelector, useDispatch} from 'react-redux';
import {addNewMsg} from '../../redux/actions/conversationsActions';

function Input() {
  const currConv = useSelector(state => state.conversations.find(conv => conv._id === state.currConv._id))
  const [chatInput, setChatInput] = useState("");
  const user = useContext(UserInfoContext);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  
  useEffect(() => {
    inputRef.current.focus()
  }) 

  function send(e) {
    const currConvId = currConv._id;

    if (chatInput) {
      sendAxios(chatInput, currConv.members.map(members => members._id))

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

  async function sendAxios(messageBody, convMembers) {
    try {
      const {data} = await axios.post(`/chat/conversations/${currConvId}/messages`, {
        messageBody: messageBody,
        convMembers: convMembers
      });

    } catch (err) {
      console.error(err)
    }
  }

  function onInputChange(e) {
      setChatInput(e.target.value);
  }

  return (
    <div className={styles.inputContainer}>
      <input
        className={styles.input}
        ref={inputRef}
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