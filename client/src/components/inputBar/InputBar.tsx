import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import uniqid from 'uniqid';
import { useHistory, useRouteMatch } from 'react-router-dom';

import styles from './inputBar.module.css';
import {socket} from "../../App";

import {Message, Conversation, User} from "../../shared/types/dbSchema";

import {useSelector, useDispatch} from 'react-redux';
import {addNewMsg, msgSent, patchConv} from '../../redux/actions/conversationsActions';
import {rootState} from '../../redux/store';
import { UserInfo } from 'redux/actions/userInfoActions';

const Input = () => {
  const match = useRouteMatch<{convId: string}>();
  const currConv = useSelector(((state: rootState) => state.conversations.find(conv => conv._id === match.params.convId)));
  const [chatInput, setChatInput] = useState("");
  const user = useSelector((state: rootState) => state.userInfo as UserInfo)
  const inputRef = useRef<HTMLInputElement>(null!);
  const dispatch = useDispatch();
  const lastMsgSent = useRef<Message>(null!);
  const typingTimeout = useRef<number | undefined>(undefined);
  const history = useHistory();

  useEffect(() => {
    inputRef.current?.focus()
  }, [currConv?._id]);

  if (currConv === undefined) {
    return null;
  }

  const handleSend = () => {
    const currConvId = currConv._id;
    const convHasCreated = currConv.convHasCreated;
    const currConvMembers = (currConv.members as User[]).map(members => members._id);
    lastMsgSent.current = createMsgObj(user.userId, chatInput);

    if (typingTimeout.current) {
      socket.emit('stopTyping', currConvId, user.userId);
      typingTimeout.current = undefined;
    }

    dispatch(addNewMsg(currConvId, lastMsgSent.current, false));

    if (convHasCreated) {
      sendMsgReq(chatInput, currConvMembers, currConvId);
    } else {
      //The conversation doesn't exist yet in the DB
      let membersId: string[] = [];
      currConv.members.forEach(user => membersId.push(user._id))

      createConvDoc(membersId, (conv) => {
        sendMsgReq(chatInput, currConvMembers, conv._id);

        //Get the whole conv with the populated members field
        getTheConvDoc(conv._id, (conv) => {
          delete conv.last_message;

          dispatch(patchConv(currConvId, {...conv, convHasCreated: true}));
          history.push(`/chat/${conv._id}`);
        })
      });
    }

    setChatInput('');
  }

  const createMsgObj = (senderId: string, messageBody: string) => {
    const currConvId = currConv._id;
    return {
      _id: uniqid() as string,
      conversation_id: currConvId,
      sender: senderId,
      message_body: messageBody,
      date_sent: Date.now(),
      is_sent: false
    }
  }

  const sendMsgReq = async (messageBody: string, convMembers: string[], convId: string) => {
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

  const createConvDoc = async (membersId: string[], callback: (data: Conversation) => void) => {
    try {
      const {data} = await axios.post<Conversation>('/chat/conversations', {
        membersId: membersId
      });

      callback(data);
    } catch (err) {
      console.error(err);
    }
  }

  const getTheConvDoc = async (convId: string, callback) => {
    try {
      const {data} = await axios.get(`chat/conversations/${convId}`);

      callback(data.conversation);
    } catch (err) {
      console.error(err);
    }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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