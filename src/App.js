import React, { useReducer, useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import { UserReducer } from "./reducers/UserReducer";
import { UserContext } from "./context/UserContext";
import Auth from './screens/Auth';
import Nav from './components/Nav';
import { StravaConnect } from './screens/StravaConnect';
import { StravaToken } from './screens/StravaToken';
import { StravaData } from './screens/StravaData';
import firebase from 'firebase/app';
import axios from 'axios';
import 'firebase/auth';
import { SignupConfirm } from './screens/SignupConfirm';
import PoweredByStrava from './resources/images/poweredbystrava.png';
import './App.css';
import { extractQueries } from './helpers';

import config from './config';

const App = () => {
  
  const initialUserState = {
    user: null,
    strava: null,
  };

  const hrefQueries = window.location.href.split("?");
  let queries;
  if (hrefQueries.length > 1) {
    queries = extractQueries(window.location.href);
  }

  const [userChecked, setUserChecked] = useState(false);
  const [userDetails, setUserDetails] = useState(false);
  const [unverified, setUnverified] = useState(false);
  const [appInit, setAppInit] = useState(false);
  const [signupComplete, setSignupComplete] = useState(queries && queries.confirm && queries.confirm === "success");

  if (!appInit) {
    if (!firebase.apps.length) {
      firebase.initializeApp(config.firebaseConfig);
    }
    if (config.env && config.env.toLowerCase() === "dev") {
      console.log("DEV MODE.");
      axios.defaults.baseURL = "http://localhost:5000/cycle-saver/us-central1/app/";
    } else {
      axios.defaults.baseURL = "https://us-central1-cycle-saver.cloudfunctions.net/app/";
    }
    setAppInit(true);
  }

  const userReducer = (state, action) => UserReducer(state, action);
  const [userState, userDispatch] = useReducer(userReducer, initialUserState);

  if (!userChecked || signupComplete) {
    // check for logged in user with firebase once
    firebase.auth().onAuthStateChanged(signedInUser => {
      if (signedInUser) {
        if (config.env && config.env.toLowerCase() === "dev") {
          console.log(signedInUser);
        }
        if (!signedInUser.emailVerified) {
          setUnverified(true);
        }
        signedInUser.getIdToken().then(idToken => {
          const user = { signedInUser, idToken };
          userDispatch({ type: "CHECK_LOGIN_SUCCESS", user });
          setUserDetails(true);
        }).catch(e => {
          console.error(`Failed to get id token, requests will fail, ${e}`);
          userDispatch({ type: "CHECK_LOGIN_FAIL" });
          setUserDetails(true);
        });
      } else {
        userDispatch({ type: "CHECK_LOGIN_FAIL" });
        setUserDetails(true);
      }
    });
    setSignupComplete(false);
    setUserChecked(true);
  }

  return (
    <UserContext.Provider value={[userState, userDispatch]}>
      <Router>
        <div className="app-wrapper">
          <Nav user={userState}/>
          <div className="app-content">
            {userDetails && unverified ? 
              <div>
                Please check your email to verify your login.
                <Route
                    path="/signup/confirm"
                    exact
                    component={(props) =>
                      <SignupConfirm
                        routerProps={props}
                      />
                    }
                  />
              </div>
            : userDetails && userState.user ?
              <>
                <div className="app-intro">
                  <div>See how much you save by running, walking or cycling to work. N+1</div>
                  {userState.strava ? null : <StravaConnect user={userState.user}/>}
                  <Route
                    path="/strava/token"
                    exact
                    component={(props) =>
                      <StravaToken
                        user={userState.user}
                        routerProps={props}
                      />
                    }
                  />
                  <StravaData />
                </div>
              </>
            : userDetails && <Auth />}
          </div>
          <footer className="app-footer">
            <img alt="powered_by_strava" src={PoweredByStrava} />
          </footer>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;