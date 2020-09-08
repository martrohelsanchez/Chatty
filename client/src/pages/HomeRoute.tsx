import React from 'react';

import {useSelector} from 'react-redux';
import {Redirect} from 'react-router-dom';

import {rootState} from '../redux/store'; 

const HomeRoute = () => {
    const userInfo = useSelector((state: rootState) => state.userInfo);

    return (
        <div>
            {userInfo ? (
                <Redirect to='/chat' />
            ) : (
                'Home'
            )}
        </div>
    )
}

export default HomeRoute;