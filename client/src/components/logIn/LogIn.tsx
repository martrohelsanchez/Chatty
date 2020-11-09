import React, {useState, useEffect, useRef} from 'react';
import {useHistory} from 'react-router-dom';

import Loading from 'components/loading/Loading';
import {logInReq, UserAuthRes} from 'api/APIUtils';
import * as S from './Login.styles';
import next from 'images/next.svg'
import ChittyTyping from 'components/chittyTyping/ChittyTyping';

import {useDispatch} from 'react-redux';
import {setUserInfo} from 'redux/actions/userInfoActions';

const LogIn = () => {
    const [usernameInput, setUsernameInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeout = useRef<number | undefined>(undefined);
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

            const data = await logInReq(usernameInput.trim(), passInput);
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

                passInputRef.current.blur();
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
            } // if isAuth is false, server sends 401 status as an Error object
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

    function typing() {
        clearTimeout(typingTimeout.current);

        if (isTyping) {
            setTypingTimeout();
        } else {
            setIsTyping(true);
            setTypingTimeout();
        }
    }

    function setTypingTimeout() {
        typingTimeout.current = setTimeout(() => {
            typingTimeout.current = undefined;
            setIsTyping(false);
        }, 1000);
    }

    function handleUsernameChange(e) {
        setUsernameInput(e.target.value);
        typing();
    }

    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPassInput(e.target.value);
        typing();
    }

    return (
        <S.LogIn>
            <S.ChittyName>
                Chitty
            </S.ChittyName>
            <S.Wrapper>
                {/* <S.ChittyMascot mascot={chittyMascot} /> */}
                <ChittyTyping isTyping={isTyping} />
                <div>
                    <S.LogInName>Log In</S.LogInName>
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
                        onKeyDown={(e) => e.key === 'Enter' ? handleLogIn() : null}
                    />
                    <S.Register to='/signUp'>
                        Register
                    </S.Register>
                </div>
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