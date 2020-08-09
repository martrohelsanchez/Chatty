import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import uniqid from 'uniqid';

import styles from './inputBar.module.css';
import {UserInfoContext, socket} from '../../App';

import {useSelector, useDispatch} from 'react-redux';
import {addNewMsg, msgSent} from '../../redux/actions/conversationsActions';

function Input() {
  const currConv = useSelector(state => state.conversations.find(conv => conv._id === state.currConv._id))
  const [chatInput, setChatInput] = useState("");
  const user = useContext(UserInfoContext);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const lastMsgSent = useRef(null);
  const typingTimeout = useRef(null);
  
  useEffect(() => {
    inputRef.current.focus()
  }, []);

  function handleSend(e) {
    const currConvId = currConv._id;

    if (typingTimeout.current) {
      socket.emit('stopTyping', currConvId, user.userId);
      typingTimeout.current = undefined;
    }

    if (chatInput) {
      lastMsgSent.current = createMsgObj(user.userId, user.username, chatInput);

      sendAxios(chatInput, currConv.members.map(members => members._id));
      dispatch(addNewMsg(currConvId, lastMsgSent.current));
      setChatInput("");
    }
  }

  function createMsgObj(senderId, username, messageBody) {
    const currConvId = currConv._id;
    
    return {
      _id: uniqid(),
      conversation_id: currConvId,
      sender: {
        username: username,
        _id: senderId
      },
      message_body: messageBody,
      is_delivered: false,
      date_sent: Date.now(),
      is_sent: false
    }
  }

  async function sendAxios(messageBody, convMembers) {
    try {
      const currConvId = currConv._id;
      const {data} = await axios.post(`/chat/conversations/${currConvId}/messages`, {
        messageBody: messageBody,
        convMembers: convMembers
      });

      dispatch(msgSent(lastMsgSent.current._id, currConvId, data.date_sent, data._id));
    } catch (err) {
      console.error(err)
    }
  }


  function onInputChange(e) {
    const currConvId = currConv._id;

    setChatInput(e.target.value);

    if (!typingTimeout.current) {
      socket.emit('startTyping', currConvId, user.userId);
    }

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit('stopTyping', currConvId, user.userId);
      typingTimeout.current = undefined;
    }, 5000)
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
        onKeyDown={({key}) => key === 'Enter' ? handleSend() : null }
      />
      <button className={styles.sendBtn} onClick={handleSend}>
        Send
      </button>
    </div>
  );
}

export default Input;