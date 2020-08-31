import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {Switch, Route} from 'react-router-dom';

import { reAuthReq } from '../api/APIUtils';
import ChatRoute from './ChatRoute';
import LogInRoute from './LogInRoute';
import SignUpRoute from './SignUpRoute';
import SplashScreen from '../components/splashScreen/SplashScreen';

import {useDispatch, useSelector} from 'react-redux';
import {setUserInfo} from '../redux/actions/userInfoActions';
import HomeRoute from './HomeRoute';

function AppRoute() {
    const dispatch = useDispatch();
    const [triedAuthUser, setTriedAuthUser] = useState(false);

    //try to authenticate when user visits the website
    if (!triedAuthUser) {
        const storedCsrfToken = window.localStorage.getItem('csrfToken');

        if (storedCsrfToken) {
            reAuthReq(data => {
                window.localStorage.setItem('csrfToken', data.csrfToken)

                ReactDOM.unstable_batchedUpdates(() => {
                    setTriedAuthUser(true);
                    dispatch(setUserInfo({userId: data._id, username: data.username}));
                }) ;
            }, err => {
                setTriedAuthUser(true);
            });
        } else {
            setTriedAuthUser(true);
        }
    }


    return (
        <>
            {triedAuthUser ? (
                <Switch>
                    <Route exact={true} path='/'>
                        <HomeRoute />
                    </Route>
                    <Route path='/chat'>
                        <ChatRoute />
                    </Route>
                    <Route path='/logIn'>
                        <LogInRoute />
                    </Route>
                    <Route path='/signUp'>
                        <SignUpRoute />
                    </Route>
                </Switch>
            ) : (
                <SplashScreen />
            )}
        </>
    )
}

export default AppRoute;