import React from 'react';

import SignUp from 'components/signUp/SignUp';
import {useSelector} from 'react-redux';
import {Redirect} from 'react-router-dom';

import {rootState} from "../../redux/store";

function SignUpRoute() {
    const userInfo = useSelector((state: rootState) => state.userInfo);

    return (
        <>
            {userInfo ? (
                <Redirect to='/chat' />
            ) : (
                <SignUp />
            )}
        </>
    )
}

export default SignUpRoute;