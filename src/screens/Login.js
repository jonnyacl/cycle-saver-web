import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import firebase from 'firebase/app';
import 'firebase/auth';
import { useForm } from "react-hook-form";
import '../styles/buttons.css';

const Login = ({ setSignUp }) => {
  // eslint-disable-next-line no-unused-vars
  const [userState, dispatch] = useContext(UserContext);
  const { handleSubmit } = useForm();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const signin = () => {
    setIsLoading(true);
    console.log(`Signing in ${email}`);
    firebase.auth().signInWithEmailAndPassword(email, password).then(u => {
      u.user.getIdToken().then(idToken => {
        const user = { signedInUser: u.user, idToken };
        setIsLoading(false);
        dispatch({ type: "LOGIN_SUCCESS", user });
      }).catch(e => {
        console.error(`Failed to get id token, requests will fail, ${e}`);
        setIsLoading(false);
        dispatch({ type: "LOGIN_FAIL" });
      });
    }).catch(e => {
      let message = "Incorrect user or password";
      if (e.message && e.message.includes("invalid-email")) {
        message = "Invalid email"
      }
      console.error(e);
      console.error(message);
      setIsLoading(false);
      setLoginError(message);
      dispatch({ type: "LOGIN_FAIL" });
    });
  };

  const validateLoginForm = () => {
    return email && email.length > 0 && password && password.length > 0;
  };

  const renderErrors = () => {
    if (loginError && loginError.length > 0) {
      return (
        <div className="div-danger">
          <div>{loginError}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div>Login</div>
      <form onSubmit={handleSubmit(signin)}>
        <label>Email
          <input
            autoFocus
            value={email}
            onChange={e => {
              setEmail(e.target.value);
              setLoginError("");
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
                setLoginError("");
              }}
            />
          </label>
          {isLoading ?  <button disabled={true}>Logging in...</button> : <button disabled={!validateLoginForm()} type="submit">Login</button>}
          {renderErrors()}
      </form>
      <div className="clickable" onClick={() => {setSignUp(true)}}>Sign up here</div>
    </>
  );
};

export default Login;
