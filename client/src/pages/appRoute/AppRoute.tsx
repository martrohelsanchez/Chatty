import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {Switch, Route} from 'react-router-dom';

import {reAuthReq} from '../../api/APIUtils';
import ChatRoute from '../chatRoute/ChatRoute';
import LogInRoute from "pages/logInRoute/LogInRoute";
import SignUpRoute from "pages/signUpRoute/SignUpRoute";
import SplashScreen from '../../components/splashScreen/SplashScreen';
import useHasUnmounted from "../../hooks/useHasUnmounted";
import HomeRoute from '../homeRoute/HomeRoute';
import UserRoute from 'pages/userRoute/UserRoute';
import useUserJustReg from 'hooks/useUserJustReg';

import {useDispatch} from 'react-redux';
import {setUserInfo} from '../../redux/actions/userInfoActions';

export interface IsUserJustReg {
    justRegistered: boolean,
    setIsUserJustReg: React.Dispatch<React.SetStateAction<boolean>>
}

export const IsUserJustRegistered = React.createContext<IsUserJustReg>(null!);

const AppRoute = () => {
    const dispatch = useDispatch();
    const [triedAuthUser, setTriedAuthUser] = useState(false);
    const hasUnmounted = useHasUnmounted();
    const isUserJustRegistered = useUserJustReg();

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
                            username: data.username,
                            bio: data.bio,
                            header: data.header,
                            profile_pic: data.profile_pic
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
                <IsUserJustRegistered.Provider value={isUserJustRegistered}>
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
                        <Route path='/user'>
                            <UserRoute />
                        </Route>
                    </Switch>
                </IsUserJustRegistered.Provider>
            ) : (
                <SplashScreen />
            )}
        </>
    )
}

export default AppRoute;