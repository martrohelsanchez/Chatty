import React from 'react';

import LogIn from '../components/logIn/logIn';
import {useSelector} from 'react-redux';
import {Redirect} from 'react-router-dom';

import {rootState} from "../redux/store";

const LogInRoute = () => {
    const userInfo = useSelector((state: rootState ) => state.userInfo);

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