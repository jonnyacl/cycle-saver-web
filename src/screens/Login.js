import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { auth } from "firebase";
import { useForm } from "react-hook-form";

const Login = ({ setSignUp }) => {
  const [userState, dispatch] = useContext(UserContext);
  const { handleSubmit } = useForm();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const signin = () => {
    setIsLoading(true);
    console.log(`Signing in ${email}`)
    auth().signInWithEmailAndPassword(email, password).then(u => {
      setIsLoading(false);
      dispatch({ type: "LOGIN_SUCCESS", user: u });
    }).catch(e => {
      let message = "Incorrect user or password";
      if (e.message && e.message.includes("invalid-email")) {
        message = "Invalid email"
      }
      console.log(message);
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
              autoFocus
              onChange={e => {
                setPassword(e.target.value);
                setLoginError("");
              }}
            />
          </label>
          {isLoading ?  <button>Logging in...</button> : <button type="submit">Login</button>}
          {renderErrors()}
      </form>
      <button onClick={() => {setSignUp(true)}}>Sign up here</button>
    </>
  );
};

export default Login;
