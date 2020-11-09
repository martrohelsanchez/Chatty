import React, {useState, useEffect} from 'react';

import Conversation from "components/conversation/Conversation";
import {getConversationsReq, updateMsgIsDeliveredReq, getLastSeen} from 'api/APIUtils';

import {rootState} from 'redux/store';
import {Conversation_LastMessage, LastSeen} from 'shared/types/dbSchema';

import {useDispatch, useSelector} from 'react-redux';
import {retrieveConversations} from 'redux/actions/conversationsActions';
import {UserInfo} from 'redux/actions/userInfoActions';
import Typing from 'components/typing/Typing';

const ConversationList = () => {
    const conversations = useSelector((state: rootState) => state.conversations);
    const [err, setErr] = useState<string | null>(null);
    const [numOfLoading, setNumOfLoading] = useState(0);
    const dispatch = useDispatch();
    const user = useSelector((state: rootState) => state.userInfo as UserInfo);
    const [userLastSeen, setUserLastSeen] = useState<LastSeen | null>(null);

    useEffect(() => {
        if (conversations.length === 0) {
            setNumOfLoading(c => c + 1);
            getConversationsReq(10, null, data => {
                dispatch(retrieveConversations(data.conversations));
                checkLastMsgDeliver(data.conversations);
                setNumOfLoading(c => c - 1);
            }, err => {
                console.error(err.message)
                setErr('Something went wrong')
                setNumOfLoading(c => c - 1);
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, conversations.length]);

    useEffect(() => {
        setNumOfLoading(c => c + 1);
        getLastSeen((data) => {
            setUserLastSeen(data);
            setNumOfLoading(c => c - 1);
        }, (err) => {
            console.error(err.message);
            setErr('Something went wrong');
            setNumOfLoading(c => c - 1);
        })
    }, []);

    //Check if the last message of a conversation hasn't been delivered
    function checkLastMsgDeliver (conversations: Conversation_LastMessage[]) {
        for (let conversation of conversations) {
            const {last_message, _id} = conversation;

            if (last_message === null) continue

            if (last_message.sender !== user.userId && !last_message.is_delivered) {
                updateMsgIsDeliveredReq(_id, last_message._id, (err) => {
                    console.error(err);
                    setErr('Something went wrong')
                })
            }
        }
    }

    console.log(numOfLoading)

    if (numOfLoading > 0) {
        return (
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div
                    style={{
                        width: '20%',
                        margin: '-50px',
                        position: 'relative'
                    }}
                >
                    <Typing forMascot={false} />
                </div>
            </div>
        )
    } else if (err) {
        return <div>{err}</div>
    }

    const conversationList = conversations.map(conv => {
        if (conv.convHasCreated) {
            return <Conversation key={conv._id} conv={conv} userLastSeenDoc={userLastSeen} />
        }
        return null;
    });

    return (
      <div
        style={{
            overflow: 'hidden'
        }}
      >
        {conversationList}
      </div>
    );
}

export default ConversationList