import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import firebase from 'firebase/app';
import 'firebase/auth';
import config from '../config';

const Signup = ({ setSignUp }) => {

  // eslint-disable-next-line no-unused-vars
  const [userState, dispatch] = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupError, setSignupError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const url = config.env === 'dev' ? 'http://localhost:3000/signup/confirm' : `https://${config.firebaseConfig.authDomain}/signup/confirm`;

  const register = () => {
    setIsLoading(true);
    firebase.auth().createUserWithEmailAndPassword(email, password).then(u => {
      const actionCodeSettings = {
        url: `${url}?email=${email}`,
        handleCodeInApp: true
      };
      u.user.sendEmailVerification(actionCodeSettings)
        .catch(e => {
          console.error(`Failed to send confirm email: ${JSON.stringify(e)}`);
        });
      u.user.getIdToken().then(idToken => {
        const user = { signedInUser: u.user, idToken };
        setIsLoading(false);
        dispatch({ type: "LOGIN_SUCCESS", user });
      }).catch(e => {
        console.error(`Failed to get id token, requests will fail, ${e}`);
        dispatch({ type: "SIGNUP_FAIL" });
      });
    }).catch(e => {
      console.error(`Failed to sign up ${e}`);
      setSignupError("Error signing up");
      setIsLoading(false);
      dispatch({ type: "SIGNUP_FAIL" });
    });
  };

  const validateSignupForm = () => {
    return email && email.length > 0 && password && password.length > 0 && confirmPassword && confirmPassword === password;
  };

  const renderSignupErrors = () => {
    if (signupError && signupError.length > 0) {
      return (
        <div>
          <div>{signupError}</div>
        </div>
      );
    }
    return null;
  };

  const renderFormErrors = () => {
    let formError = null;
    if (password && confirmPassword && password !== confirmPassword) {
      formError = "Passwords do not match";
    }
    if (!!formError) {
      return (
        <div>
          <div>{formError}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div>Signup</div>
      <form>
        <label>Email
          <input
            autoFocus
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              setSignupError("");
            }}
            placeholder="Email"
          />
        </label>
        <label>Password
          <input
            type="password"
            autoFocus
            onChange={e => {
              setPassword(e.target.value);
              setSignupError("");
            }}
          />
        </label>
        <label>Confirm Password
          <input
            type="password"
            autoFocus
            value={confirmPassword}
            onChange={e => {
              setConfirmPassword(e.target.value);
              setSignupError("");
            }}
          />
        </label>
        {isLoading ? <button disabled={true}>Signing up...</button> :
          <button
            onClick={() => register()}
            disabled={!validateSignupForm()}>Register
          </button>}
        
        {renderFormErrors()}
        {renderSignupErrors()}
      </form>
      <div className="clickable" onClick={() => {setSignUp(false)}}>Login here</div>
    </>
  );
}

export default Signup;