import React from 'react';
import {Route, useRouteMatch, useHistory} from 'react-router-dom';
import {useSelector} from 'react-redux';

import * as S from './MessagesPane.styles';
import InputBar from 'components/inputBar/InputBar'
import MessageList from 'components/messages/MessageList'
import {getConversationName, getConvPic} from 'shared/utils/helpers';
import infoBtnIcon from 'images/info_btn.svg';

import {rootState} from 'redux/store';
import {UserInfo} from 'redux/actions/userInfoActions';

const MessagePane = () => {
    const messagesMatchRoute = useRouteMatch<{convId: string}>('/chat/:convId');
    const currConv = useSelector((state: rootState) => state.conversations.find(conv => conv._id === messagesMatchRoute?.params.convId));
    const showInMobile = messagesMatchRoute ? messagesMatchRoute.isExact : false;
    const user = useSelector((state: rootState) => state.userInfo);
    const history = useHistory();
    let convPic;

    if (currConv) {
        convPic = getConvPic(currConv, user);
    }

    const onInfoBtnClick = () => {
        history.push(`/chat/${messagesMatchRoute?.params.convId}/info`);
    }

    return (
        <S.MessagePane showInMobile={showInMobile}>
            <Route path='/chat/:convId'>
                {currConv ? (
                    <>
                        <S.ConvNameCont>
                            <S.ConvName>
                                {getConversationName(currConv as NonNullable<typeof currConv>, user as UserInfo)}
                            </S.ConvName>
                            <S.InfoBtn src={infoBtnIcon} onClick={onInfoBtnClick} />
                        </S.ConvNameCont>
                        <S.OuterCircle>
                            <S.ConvPic pic={convPic} />
                        </S.OuterCircle>
                        {currConv.convHasCreated ? (
                            <MessageList currConv={currConv} />
                        ) : (
                            null
                        )}
                        <InputBar />
                    </>
                ) : (
                    null
                )}
            </Route>
        </S.MessagePane>
    )
}

export default MessagePane;