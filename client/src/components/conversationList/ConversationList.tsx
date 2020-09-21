import React, {useState, useEffect} from 'react';

import Conversation from "components/conversation/Conversation";
import Loading from 'components/loading/Loading';
import {getConversationsReq, updateMsgIsDeliveredReq} from 'api/APIUtils';

import {rootState} from 'redux/store';
import {ConversationPopulateMembers} from 'shared/types/dbSchema';

import {useDispatch, useSelector} from 'react-redux';
import {retrieveConversations} from 'redux/actions/conversationsActions';
import {UserInfo} from 'redux/actions/userInfoActions';

const ConversationList = () => {
    const conversations = useSelector((state: rootState) => state.conversations);
    const [err, setErr] = useState<string | null>(null);
    const dispatch = useDispatch();
    const user = useSelector((state: rootState) => state.userInfo as UserInfo);

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

    //Check if the last message of a conversation hasn't been delivered
    const checkLastMsgDeliver = (conversations: ConversationPopulateMembers[]) => {

        for (let conversation of conversations) {
            const {last_message, _id} = conversation;

            if (last_message.sender_id !== user.userId && !last_message.is_delivered) {
                updateMsgIsDeliveredReq(_id, last_message.sender_id, (err) => {
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
        return <Conversation key={conv._id} conv={conv} />
    });

    return (
      <div>
        {renderConversations}
      </div>
    );
}

export default ConversationList