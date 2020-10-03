import React, {useState, useRef} from 'react';
import {useHistory} from 'react-router-dom';
import axios from 'axios';

import next from 'images/next.svg';
import * as S from './SignUp.styles';
import { getUserByUsernameReq } from 'api/APIUtils';

function SignUp() {
  const [usernameInput, setUsernameInput] = useState('');
  const [passInput, setPassInput] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [isUsernameScreen, setIsUsernameScreen] = useState(true);
  const confirmPassRef = useRef<HTMLInputElement>(null!);
  const [err, setErr] = useState<string | null>(null!);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();

  function signUp() {
    if (!usernameInput) {
      return null;
    } 

    axios.post('/user/signUp', {
        username: usernameInput.trim(),
        password: confirmPass.trim()
    }, {
      withCredentials: true
    })
        .then(({data}) => {
            if (!data.isUsernameTaken) {
                setUsernameInput('')
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

  const onUsernameSubmit = () => {
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
        <S.ChittyMascot/>
        <S.Err>{err}</S.Err>
        {isUsernameScreen ? (
          <S.Input
            type="input"
            value={usernameInput}
            placeholder='What should everyone call you?'
            onChange={onUsernameChange}
            onKeyDown={({key}) => (key === 'Enter' ? onUsernameSubmit() : null)}
          />
        ) : (
          <>
            <S.Input
              type="password"
              value={passInput}
              placeholder='Password'
              onChange={onPassChange}
              onKeyDown={({key}) => (key === 'Enter' ? confirmPassRef.current.focus() : null)}
            />
            <S.Input
              type="password"
              ref={confirmPassRef}
              value={confirmPass}
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
          {isUsernameScreen || <S.BackBtn src={next} onClick={handleBack}></S.BackBtn>}
          <S.NextBtn src={next} onClick={onUsernameSubmit}></S.NextBtn>
        </div>
      </div>
    </S.SignUp>
  );
}

export default SignUp