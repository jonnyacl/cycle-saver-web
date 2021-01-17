import React, { useState, useReducer, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom';
import { UserReducer } from "./reducers/UserReducer";
import { UserContext } from "./context/UserContext";
import Auth from './screens/Auth';
import Nav from './components/Nav';
import { StravaToken } from './screens/StravaToken';
import { StravaData } from './screens/StravaData';
import { StravaActivity } from './screens/StravaActivity';
import firebase from 'firebase/app';
import axios from 'axios';
import 'firebase/auth';
import { SignupConfirm } from './screens/SignupConfirm';
import PoweredByStrava from './resources/images/poweredbystrava.png';
import './App.scss';
import { extractQueries } from './helpers';
import Profile from './screens/Profile';
import Settings from './screens/Settings';
import ApiCaller from './api/ApiWrapper';

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

  useEffect(() => {
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
    // eslint-disable-next-line
  }, []);
  
  const userReducer = (state, action) => UserReducer(state, action);
  const [userState, userDispatch] = useReducer(userReducer, initialUserState);

  useEffect(() => {
    if (appInit && (!userChecked || signupComplete)) {
      // check for logged in user with firebase once
      firebase.auth().onAuthStateChanged(signedInUser => {
        if (signedInUser) {
          if (config.env && config.env.toLowerCase() === "dev") {
            console.log('firebase user', signedInUser);
          }
          if (!signedInUser.emailVerified) {
            setUnverified(true);
          }
          signedInUser.getIdToken().then(idToken => {
            const user = { signedInUser, idToken };
            axios.defaults.headers["Authorization"] = `Bearer ${idToken}`;
            // fetch strava profile
            if (signedInUser.emailVerified) {
              const apiReq = new ApiCaller(`/${user.signedInUser.uid}/athletes`, "get");
              apiReq.execute().then(athletes => {
                  if (athletes.length) {
                      const athlete = athletes[0];
                      userDispatch({ type: 'STRAVA_PROFILE_SUCCESS', athlete, user });
                      setUserDetails(true);
                  }
              }).catch(() => {
                  console.log("No athlete");
                  userDispatch({ type: "CHECK_LOGIN_SUCCESS", user });
                  setUserDetails(true);
              });
            } else {
              userDispatch({ type: 'PROFILE_SUCCESS', user });
              setUserDetails(true);
            }
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
    // eslint-disable-next-line
  }, [appInit]);

  return (
    <UserContext.Provider value={[userState, userDispatch]}>
      <Router>
        <div className="app-wrapper">
          <Nav user={userState}/>
          {!appInit || !userChecked || !userDetails ? <div /> : 
          <div className="app-content">
            {userDetails && userState.user && unverified ? 
              <div>
                <div>Please click the link sent to <b>{userState.user.email}</b> to verify your login.</div>
                <Route
                    path="/signup/confirm"
                    exact
                    component={() =>
                      <SignupConfirm />
                    }
                  />
              </div>
            : userDetails && userState.user ?
              <>
                <div className="app-main">
                  <Route
                    path="/strava/token"
                    exact
                    component={() =>
                      <StravaToken
                        user={userState.user}
                      />
                    }
                  />
                  <Route
                    path="/profile"
                    exact
                    component={() =>
                      <Profile />
                    }
                  />
                  <Route
                    path="/settings"
                    exact
                    component={() =>
                      <Settings />
                    }
                  />
                  <Route
                    path="/"
                    exact
                    component={() =>
                      <StravaData />
                    }
                  />
                  <Route
                    path="/activity/:id"
                    component={() =>
                      <StravaActivity />
                    }
                  />
                </div>
              </>
            : userDetails && <Auth />}
          </div>}
          <footer className="app-footer">
            <a href="https://www.strava.com" target="_blank" rel="noopener noreferrer">
              <img alt="powered_by_strava" src={PoweredByStrava} />
            </a>
          </footer>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;