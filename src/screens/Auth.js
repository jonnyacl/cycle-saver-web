import React, { useState } from "react";
import Signup from "./Signup";
import Login from "./Login";

const Auth = () => {
  const [signUp, setSignUp] = useState(false);
  if (signUp) {
    return <Signup setSignUp={setSignUp} />;
  } else {
    return <Login setSignUp={setSignUp} />;
  }
};

export default Auth;
