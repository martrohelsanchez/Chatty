import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';

import {useSelector} from 'react-redux';
import {rootState} from 'redux/store';
import UserProfile from 'components/userProfile/UserProfile';

const UserRoute = () => {
    const userInfo = useSelector((state: rootState) => state.userInfo);

    return (
        <>
            {userInfo ? (
                <Switch>
                    <Route to='/user/:userId'>
                        <UserProfile />
                    </Route>
                    <Route to='/user/:userId/set-header-pic'>
                        
                    </Route>
                    <Route to='/user/:userId/set-profile-pic'>

                    </Route>
                </Switch>
            ) : (
                <Redirect to='/signUp'/>
            )}
        </>
    )
}

export default UserRoute;