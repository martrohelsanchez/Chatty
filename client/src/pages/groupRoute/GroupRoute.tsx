import React from 'react';
import {useSelector} from 'react-redux';
import {Redirect} from 'react-router-dom';

import CreateGroup from 'components/createGroup/CreateGroup';

import {rootState} from 'redux/store';

const GroupRoute = () => {
    const userInfo = useSelector((state: rootState) => state.userInfo);

    return (
        <>
            {userInfo ? (
                <CreateGroup />
            ) : (
                <Redirect to='/signUp' />
            )}
        </>
    )
}

export default GroupRoute;