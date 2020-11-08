import React, {useState, useRef, useContext} from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';

import next from 'images/next.svg';
import * as S from './SignUp.styles';
import {getUserByUsernameReq} from 'api/APIUtils';
import {IsUserJustRegistered} from 'pages/appRoute/AppRoute';
import chittyMascot from '../../images/chitty_mascot.svg'

import {useDispatch} from 'react-redux';
import {setUserInfo} from 'redux/actions/userInfoActions';

function SignUp() {
  const [usernameInput, setUsernameInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [isUsernameScreen, setIsUsernameScreen] = useState(true);
  const confirmPassRef = useRef<HTMLInputElement>(null!);
  const [err, setErr] = useState<string | null>(null!);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const justReg = useContext(IsUserJustRegistered);
  const dispatch = useDispatch();

  function signUp() {
    if (!usernameInput) {
      return null;
    } 

    axios.post<{
      userId: string,
      username: string,
      isUsernameTaken: boolean,
      csrfToken: string
    }>('/user/signUp', {
        username: usernameInput.trim(),
        password: confirmPass.trim()
    }, {
      withCredentials: true
    })
        .then(({data}) => {
            if (!data.isUsernameTaken) {
                window.localStorage.setItem('csrfToken', data.csrfToken);
                
                setUsernameInput('')
                dispatch(setUserInfo({
                  userId: data.userId,
                  username: data.username,
                }))
                justReg.setIsUserJustReg(true);
                history.push(`/user/${data.userId}`)
            } else {
                setErr('User already exists')
            }
        })
        .catch(err => {
            setErr('Sorry, something went wrong. Please try again later')
        })
    setErr(null)
  }

  const onUsernameSubmit = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    e.currentTarget.blur();

    setErr(null);
    setIsLoading(true);
    getUserByUsernameReq(usernameInput, (data) => {
      if (data) {
        //A user exist with this username
        setErr('Username already taken');
      } else {
        setIsUsernameScreen(false);
      }
      setIsLoading(false);
    }, (err) => {
      console.error(err);
      setIsLoading(false);
      setErr('Sorry, something went wrong. Please try again later');
    })
  }

  const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setUsernameInput(e.target.value);
  }

  const onPassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassInput(e.target.value);
  }

  const onConfirmPassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPass(e.target.value);
    if (passInput === e.target.value) {
      setErr(null);
    } else {
      setErr('Passwords entered do not match');
    }
  }

  const handleBack = () => {
    setIsUsernameScreen(true);
  }

  return (
    <S.SignUp>
      <div>
        <S.ChittyName>
          Chitty
        </S.ChittyName>
        <S.ChittyMascot mascot={chittyMascot} />
        <S.Reg>Register</S.Reg>
        <S.Err>{err}</S.Err>
        {isUsernameScreen ? (
          <S.Input
            type="input"
            autoComplete="off"
            value={usernameInput}
            placeholder='What should everyone call you?'
            onChange={onUsernameChange}
            onKeyDown={(e) => (e.key === 'Enter' ? onUsernameSubmit(e) : null)}
          />
        ) : (
          <>
            <S.Input
              type="password"
              value={passInput}
              autoComplete="off"
              placeholder='Password'
              onChange={onPassChange}
              onKeyDown={({key}) => (key === 'Enter' ? confirmPassRef.current.focus() : null)}
            />
            <S.Input
              type="password"
              ref={confirmPassRef}
              value={confirmPass}
              autoComplete="off"
              placeholder='Confirm Password'
              onChange={onConfirmPassChange}
              onKeyDown={({key}) => (key === 'Enter' && !err && confirmPass ? signUp() : null)}
            />
          </>
        )}
        <S.ToLogIn to='/logIn'>
          Already have an account?
        </S.ToLogIn>
        <div style={{textAlign: 'center'}}>
          {isLoading ? (
            <S.Loading />
          ) : (
            <>
              {isUsernameScreen || <S.BackBtn src={next} onClick={handleBack}></S.BackBtn>}
              <S.NextBtn src={next} onClick={onUsernameSubmit}></S.NextBtn>
            </>
          )}
        </div>
      </div>
    </S.SignUp>
  );
}

export default SignUp