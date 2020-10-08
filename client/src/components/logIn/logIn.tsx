import React, {useState, useEffect, useRef} from 'react';
import {useHistory} from 'react-router-dom';

import Loading from 'components/loading/Loading';
import {logInReq, UserAuthRes} from 'api/APIUtils';
import * as S from './Login.styles';
import next from 'images/next.svg'

import {useDispatch} from 'react-redux';
import {setUserInfo} from 'redux/actions/userInfoActions';

const LogIn = () => {
    const [usernameInput, setUsernameInput] = useState('');
    const [err, setErr] = useState<string | null>(null);
    const usernameInputRef = useRef<HTMLInputElement>(null); 
    const history = useHistory();
    const [isLoading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [passInput, setPassInput] = useState('');
    const passInputRef = useRef<HTMLInputElement>(null!);

    useEffect(() => {
        usernameInputRef.current?.focus()
    }, []);

    async function handleLogIn () {
        try {
            setLoading(true);

            const data = await logInReq(usernameInput.trim());
            const {
                csrfToken, 
                userId, 
                username, 
                isAuth, 
                bio, 
                header, 
                profile_pic
            } = data as UserAuthRes;

            if (isAuth) {
                window.localStorage.setItem('csrfToken', csrfToken);

                setUsernameInput('');
                setPassInput('');
                setLoading(false);
                dispatch(setUserInfo({
                    userId: userId,
                    username,
                    bio,
                    header,
                    profile_pic
                }));

                history.push('/chat');
            } // if isAuth is false, server send 401 status as an Error object
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

            setLoading(false);
        }
    }

    function handleUsernameChange(e) {
        setUsernameInput(e.target.value);
    }

    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPassInput(e.target.value);
    }

    return (
        <S.LogIn>
            <S.ChittyName>
                Chitty
            </S.ChittyName>
            <S.Wrapper>
                <S.ChittyMascot />
                <S.Err>
                    {err}
                </S.Err>
                <S.Input 
                    id='nickname-input'
                    data-testid='usernameInput'
                    ref={usernameInputRef}
                    autoComplete='off'
                    placeholder='Username'
                    type="text"
                    value={usernameInput}
                    autoFocus
                    onChange={handleUsernameChange}
                    onKeyDown={({key}) => key === 'Enter' ? passInputRef.current.focus() : null}
                />
                <S.Input
                    type='password'
                    ref={passInputRef}
                    value={passInput}
                    autoComplete="off"
                    onChange={handlePasswordChange} 
                    placeholder='Password'
                    onKeyDown={({key}) => key === 'Enter' ? handleLogIn() : null}
                />
                <S.Register to='/signUp'>
                    Register
                </S.Register>
                <div style={{textAlign: 'center'}}>
                    {isLoading ? (
                        <Loading style={{ display: 'inline-block', margin: '60px auto 0 auto'}} />
                    ) : (
                        <S.LogInBtn src={next} data-testid='logInBtn' onClick={handleLogIn}></S.LogInBtn>
                    )}
                </div>
            </S.Wrapper>
        </S.LogIn>
    )
}

export default LogIn