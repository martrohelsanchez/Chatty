import React, {useState, useEffect} from 'react';

import Conversation from "components/conversation/Conversation";
import Loading from 'components/loading/Loading';
import {getConversationsReq, updateMsgIsDeliveredReq, getLastSeen} from 'api/APIUtils';

import {rootState} from 'redux/store';
import {Conversation_LastMessage, LastSeen} from 'shared/types/dbSchema';

import {useDispatch, useSelector} from 'react-redux';
import {retrieveConversations} from 'redux/actions/conversationsActions';
import {UserInfo} from 'redux/actions/userInfoActions';

const ConversationList = () => {
    const conversations = useSelector((state: rootState) => state.conversations);
    const [err, setErr] = useState<string | null>(null);
    const dispatch = useDispatch();
    const user = useSelector((state: rootState) => state.userInfo as UserInfo);
    const [userLastSeen, setUserLastSeen] = useState<LastSeen | null>(null);

    useEffect(() => {
        if (conversations.length === 0) {
            getConversationsReq(10, null, data => {
                dispatch(retrieveConversations(data.conversations));
                checkLastMsgDeliver(data.conversations);
            }, err => {
                console.error(err.message)
                setErr('Something went wrong')
            })
        }
    }, []);

    useEffect(() => {
        getLastSeen((data) => {
            setUserLastSeen(data);
        }, (err) => {
            console.error(err.message);
            setErr('Something went wrong');
        })
    }, []);

    //Check if the last message of a conversation hasn't been delivered
    const checkLastMsgDeliver = (conversations: Conversation_LastMessage[]) => {
        for (let conversation of conversations) {
            const {last_message, _id} = conversation;

            if (last_message.sender !== user.userId && !last_message.is_delivered) {
                updateMsgIsDeliveredReq(_id, last_message.sender, (err) => {
                    console.error(err);
                    setErr('Something went wrong')
                });
            }
        }
    }

    if (conversations.length === 0) {
        return <Loading />
    } else if (err) {
        return <div>{err}</div>
    }

    const renderConversations = conversations.map(conv => {
        if (conv.convHasCreated) {
            return <Conversation key={conv._id} conv={conv} userLastSeen={userLastSeen} />
        }
    });

    return (
      <div>
        {renderConversations}
      </div>
    );
}

export default ConversationList