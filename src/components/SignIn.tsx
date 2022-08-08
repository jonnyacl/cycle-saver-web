import React, { useState, ChangeEvent } from 'react';
import * as auth from 'firebase/auth';
import { sendEmailVerification } from 'firebase/auth';
import { firebaseConfig } from '../config';

type SignInValues = {
  email: string;
  password: string;
};

type SignUpValues = SignInValues & {
  confirmPassword: string;
};

type SignUpKey = 'email' | 'password' | 'confirmPassword';

const initValues = { email: '', password: '', confirmPassword: '' };

const url =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/signup/confirm'
    : `https://${firebaseConfig.authDomain}/signup/confirm`;

export const SignIn = () => {
  const [signUp, setSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<SignUpValues>(initValues);
  const [errors, setErrors] = useState<SignUpValues>(initValues);
  const [errorMessage, setErrorMessage] = useState('');

  const validate = (key: SignUpKey, newValue: string) => {
    if (key === 'email') {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(newValue)) {
        setErrors({ ...errors, email: 'Invalid email' });
      } else {
        setErrors({ ...errors, email: '' });
      }
    } else if (signUp && key === 'confirmPassword') {
      if (state.password !== newValue) {
        setErrors({ ...errors, confirmPassword: 'Passwords must match' });
      } else {
        setErrors({ ...errors, confirmPassword: '' });
      }
    } else if (key === 'password') {
    }
  };

  const isInvalid =
    Object.values(errors).some((v) => !!v) || !state.email || !state.password;

  const onChangeState = (key: SignUpKey, el: ChangeEvent<HTMLInputElement>) => {
    el.preventDefault();
    const value = el.target.value;
    setState({
      ...state,
      [key]: value,
    });
    validate(key, value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (signUp) {
        const res = await auth.createUserWithEmailAndPassword(
          auth.getAuth(),
          state.email,
          state.confirmPassword
        );
        const actionCodeSettings = {
          url: `${url}?email=${state.email}`,
          handleCodeInApp: true,
        };
        sendEmailVerification(res.user, actionCodeSettings);
      } else {
        await auth.signInWithEmailAndPassword(
          auth.getAuth(),
          state.email,
          state.password
        );
      }
    } catch (e) {
      setErrorMessage(`Failed to ${signUp ? 'sign up' : 'sign in'}`);
    }

    setLoading(false);
  };

  const renderRoutes = () => {
    return (
      <div>
        <h2>{signUp ? 'Sign Up' : 'Sign In'}</h2>
        <div>Email</div>
        <input
          value={state.email}
          onChange={(e) => onChangeState('email', e)}
        />
        <div>Password</div>
        <input
          type='password'
          value={state.password}
          onChange={(e) => onChangeState('password', e)}
        />
        {signUp && (
          <>
            <div>Confirm Password</div>
            <input
              type='password'
              value={state.confirmPassword}
              onChange={(e) => onChangeState('confirmPassword', e)}
            />
          </>
        )}
        <button
          className='clickable'
          disabled={isInvalid}
          onClick={handleSubmit}
        >
          {signUp ? 'Sign Up' : 'Sign In'}
        </button>
        {errorMessage && <div>{errorMessage}</div>}
      </div>
    );
  };

  const renderErrors = () => {
    return Object.values(errors).map((val) => {
      if (val) {
        return <div>{val}</div>;
      }
      return null;
    });
  };

  return (
    <div>
      <span
        className={`signIn-link${!signUp ? ' active' : ''}`}
        onClick={() => {
          setErrors(initValues);
          setSignUp(false);
        }}
      >
        Sign In
      </span>
      <span
        className={`signIn-link${signUp ? ' active' : ''}`}
        onClick={() => {
          setErrors(initValues);
          setSignUp(true);
        }}
      >
        Sign Up
      </span>
      {renderRoutes()}
      {renderErrors()}
      {loading ? (signUp ? 'Signing up...' : 'Signing in...') : null}
    </div>
  );
};
