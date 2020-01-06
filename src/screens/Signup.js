import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import firebase from 'firebase/app';
import 'firebase/auth';

const Signup = ({ setSignUp }) => {

  // eslint-disable-next-line no-unused-vars
  const [userState, dispatch] = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupError, setSignupError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const register = () => {
    setIsLoading(true);
    firebase.auth().createUserWithEmailAndPassword(email, password).then(u => {
      dispatch({ type: "SIGNUP_SUCCESS", user: u });
      setIsLoading(false);
    }).catch(e => {
      console.log(`Failed to sign up ${e}`);
      setSignupError("Error signing up");
      dispatch({ type: "SIGNUP_FAIL" });
      setIsLoading(false);
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
    if (password !== confirmPassword) {
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
    <form>
      <label controlId="email" bsSize="large">Email
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
      <label controlId="password" bsSize="large">Password
        <input
          type="password"
          autoFocus
          onChange={e => {
            setPassword(e.target.value);
            setSignupError("");
          }}
        />
      </label>
      <label controlId="password" bsSize="large">Confirm Password
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
        </button>
      }
      <button
        onClick={() => register()}
        disabled={!validateSignupForm() || isLoading}>Register
      </button>
      <button disabled={isLoading} onClick={() => {setSignUp(false)}}>Login</button>
      {renderFormErrors()}
      {renderSignupErrors()}
    </form>
  );
}

export default Signup;