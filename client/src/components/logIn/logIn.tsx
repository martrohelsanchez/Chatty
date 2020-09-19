import React, {useState, useEffect, useRef} from 'react';
import {useHistory} from 'react-router-dom';

import styles from './logIn.module.css';
import Loading from 'components/loading/Loading';

import { useDispatch } from 'react-redux';
import {setUserInfo} from '../../redux/actions/userInfoActions';
import {logInReq, UserAuthRes} from 'api/APIUtils';

const LogIn = () => {
    const [input, setInput] = useState('');
    const [err, setErr] = useState<string | null>(null);
    const usernameInputRef = useRef<HTMLInputElement>(null); 
    const history = useHistory();
    const [isLoading, setLoading] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        usernameInputRef.current?.focus()
    });

    const handleLogIn = (usernameInput: string) => {
        logIn(usernameInput);
    }

    const logIn = async (usernameInput: string) => {
        try {
            const data = await logInReq(usernameInput);
            const {csrfToken, userId, username, isAuth} = data as UserAuthRes;

            if (isAuth) {
                setInput('');

                dispatch(setUserInfo({
                    userId: userId,
                    username
                }));

                window.localStorage.setItem('csrfToken', csrfToken);

                history.push('/chat');
            } // if isAuth is false, server send 401 status
        } catch (err) {
            if (!err.response) {
                    console.error(err)
                    return null
                }
            const {status} = err.response;
            
            if (status === 401) {
                setErr('Wrong nickname or password');
            } else {
                setErr('Sorry, something went wrong. Please try again later')   
            }
        }
    }

    function onInputChange(e) {
        setInput(e.target.value);
    }

    function directToSignUp() {
        history.push('/signUp')
    }

    return (
        <div className={styles.logInContainer}>
            <h3 className={styles.promptNickname}>Log In</h3>
            <label htmlFor='nickname-input' className={styles.promptNickname}>Enter your nickname</label>
            <input 
                id='nickname-input'
                className={styles.nicknameInput} 
                data-testid='usernameInput'
                ref={usernameInputRef}
                type="input"
                value={input}
                autoFocus
                onChange={onInputChange}
                onKeyDown={({ key }) => key === 'Enter' ? handleLogIn(input) : null}
            />
            <div className={styles.err}>{err}</div>
            <div>
                {isLoading && <Loading />}
            </div>
            <button data-testid='logInBtn' className={styles.logInBtn} onClick={e => handleLogIn(input)}>
                Log In
            </button>
            <br />
            <p style={{textAlign: 'center'}}>
                Doesn't have an account yet?
            </p>
            <button data-testid='signUpBtn' className={styles.signUpBtn} onClick={directToSignUp}>
                Sign Up
            </button>
        </div>
    )
}

export default LogIn