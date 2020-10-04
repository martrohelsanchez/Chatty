import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {useHistory, useRouteMatch} from 'react-router-dom';

import styles from './inputBar.module.css';
import {socket} from "App";
import {User, MessageRedux, Message} from "shared/types/dbSchema";
import { sendMsgReq, createConvDocReq } from 'api/APIUtils';
import { createMsgObj } from 'shared/utils/createDummyDoc';

import {useSelector, useDispatch} from 'react-redux';
import {addNewMsg, msgSent, patchConv} from 'redux/actions/conversationsActions';
import {rootState} from 'redux/store';
import {UserInfo} from 'redux/actions/userInfoActions';

const Input = () => {
  const match = useRouteMatch<{convId: string}>();
  const currConv = useSelector(((state: rootState) => state.conversations.find(conv => conv._id === match.params.convId)));
  const [chatInput, setChatInput] = useState("");
  const user = useSelector((state: rootState) => state.userInfo as UserInfo)
  const inputRef = useRef<HTMLInputElement>(null!);
  const dispatch = useDispatch();
  const lastMsgSent = useRef<MessageRedux>(null!);
  const typingTimeout = useRef<number | undefined>(undefined);
  const history = useHistory();

  useEffect(() => {
    inputRef.current?.focus()
  }, [currConv?._id]);

  if (currConv === undefined) {
    return null;
  }

  const handleSend = async () => {
    try {
      const currConvId = currConv._id;
      const currConvMembers = (currConv.members as User[]).map(members => members._id);
      lastMsgSent.current = createMsgObj(currConvId, user.userId, user.username, chatInput);

      if (typingTimeout.current) {
        socket.emit('stopTyping', currConvId, user.userId);
        typingTimeout.current = undefined;
      }

      dispatch(addNewMsg(currConvId, lastMsgSent.current, false));

      if (currConv.convHasCreated) {
        const message = await sendMsgReq(currConvId, chatInput, currConvMembers) as Message;
        dispatch(msgSent(lastMsgSent.current._id, message.conversation_id, message.date_sent, message._id));
      } else {
        //The conversation doesn't exist in the DB
        const conv = await createConvDocReq(currConv.members);
        const message = await sendMsgReq(conv?._id as string, chatInput, currConv.members);

        //Don't overwrite last_message
        delete conv.last_message

        dispatch(msgSent(lastMsgSent.current._id, currConvId, message.date_sent, message._id));
        dispatch(patchConv(currConvId, { ...conv, convHasCreated: true }));
        history.push(`/chat/${conv._id}`);
      }

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
      typingTimeout.current = undefined;
      socket.emit('stopTyping', currConvId, user.userId);
    }, 5000)
  }

  return (
      <S.msgInputBar
        ref={inputRef}
        type="text"
        placeholder="Type a message"
        value={chatInput}
        onChange={onInputChange}
        onKeyDown={({key}) => key === 'Enter' && chatInput ? handleSend() : null }
      />
  );
}
export default Input;