import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';
import { useHistory, Redirect } from 'react-router-dom';

function HomeRoute() {
    const userInfo = useSelector(state => state.userInfo);

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