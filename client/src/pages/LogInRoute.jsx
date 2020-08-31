import React from 'react';

import LogIn from '../components/logIn/logIn';
import { useSelector } from 'react-redux';
import { useHistory, Redirect } from 'react-router-dom';

function LogInRoute() {
    const userInfo = useSelector(state => state.userInfo);

    return (
        <>
            {userInfo ? (
                <Redirect to='/chat' />
            ) : (
                <LogIn />
            )}
        </>
    )
}

export default LogInRoute;