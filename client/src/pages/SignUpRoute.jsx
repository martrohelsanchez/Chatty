import React from 'react';

import SignUp from '../components/signUp/signUp';
import { useSelector } from 'react-redux';
import { useHistory, Redirect } from 'react-router-dom';

function SignUpRoute() {
    const userInfo = useSelector(state => state.userInfo);

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