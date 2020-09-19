import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {Switch, Route} from 'react-router-dom';

import {reAuthReq} from '../../api/APIUtils';
import ChatRoute from '../chatRoute/ChatRoute';
import LogInRoute from "pages/logInRoute/LogInRoute";
import SignUpRoute from "pages/signUpRoute/SignUpRoute";
import SplashScreen from '../../components/splashScreen/SplashScreen';
import useHasUnmounted from "../../hooks/useHasUnmounted";

import {useDispatch} from 'react-redux';
import {setUserInfo} from '../../redux/actions/userInfoActions';
import HomeRoute from '../homeRoute/HomeRoute';

const AppRoute = () => {
    const dispatch = useDispatch();
    const [triedAuthUser, setTriedAuthUser] = useState(false);
    const hasUnmounted = useHasUnmounted();

    //try to authenticate when user visits the website
    if (!triedAuthUser) {
        const storedCsrfToken = window.localStorage.getItem('csrfToken');

        if (storedCsrfToken) {
            reAuthReq(data => {
                window.localStorage.setItem('csrfToken', data.csrfToken)

                if (!hasUnmounted.current) {
                    ReactDOM.unstable_batchedUpdates(() => {
                        setTriedAuthUser(true);
                        dispatch(setUserInfo({
                            userId: data.userId, 
                            username: data.username
                        }));
                    }) ;
                }
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