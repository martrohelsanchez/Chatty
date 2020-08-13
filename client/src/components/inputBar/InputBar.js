import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import uniqid from 'uniqid';

import styles from './inputBar.module.css';
import {UserInfoContext, socket} from '../../App';

import {useSelector, useDispatch} from 'react-redux';
import {addNewMsg, msgSent, patchConv} from '../../redux/actions/conversationsActions';
import { setCurrConv } from '../../redux/actions/currConvActions';

function Input() {
  const currConv = useSelector(state => state.conversations.find(conv => conv._id === state.currConv._id)) || {}
  const convHasCreated = useSelector(({currConv}) => currConv.convHasCreated === undefined ? true : currConv.convHasCreated); //if undefined means the conversation doc exists
  const [chatInput, setChatInput] = useState("");
  const user = useContext(UserInfoContext);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const lastMsgSent = useRef(null);
  const typingTimeout = useRef(null);
  
  useEffect(() => {
    inputRef.current.focus()
  }, [currConv._id]);

  function handleSend(e) {
    const currConvId = currConv._id;
    const currConvMembers = currConv.members.map(members => members._id);
    lastMsgSent.current = createMsgObj(user.userId, user.username, chatInput);

    if (typingTimeout.current) {
      socket.emit('stopTyping', currConvId, user.userId);
      typingTimeout.current = undefined;
    }

    dispatch(addNewMsg(currConvId, lastMsgSent.current));

    if (convHasCreated) {
      sendMsgReq(chatInput, currConvMembers, currConvId);
    } else {
      const membersId = currConv.members.map(user => user._id);

      createConvDoc(membersId, (conv) => {
        sendMsgReq(chatInput, currConvMembers, conv._id);

        //Get the whole conv with the populated members field
        getTheConvDoc(conv._id, (conv) => {
          delete conv.last_message;

          dispatch(setCurrConv(conv));
          dispatch(patchConv(currConvId, {...conv, convHasCreated: true}));
        })
      });
    }

    setChatInput('');
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

  async function sendMsgReq(messageBody, convMembers, convId) {
    try {
      const {data} = await axios.post(`/chat/conversations/${convId}/messages`, {
        messageBody: messageBody,
        convMembers: convMembers
      });

      dispatch(msgSent(lastMsgSent.current._id, convId, data.date_sent, data._id));
    } catch (err) {
      console.error(err)
    }
  }

  async function createConvDoc(membersId, callback) {
    try {
      const {data} = await axios.post('/chat/conversations', {
        membersId: membersId
      });

      callback(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function getTheConvDoc(convId, callback) {
    try {
      const {data} = await axios.get(`chat/conversations/${convId}`);

      callback(data);
    } catch (err) {
      console.err(err);
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
        onKeyDown={({key}) => key === 'Enter' && chatInput ? handleSend() : null }
      />
      <button className={styles.sendBtn} onClick={handleSend}>
        Send
      </button>
    </div>
  );
}

export default Input;