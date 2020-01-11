import React, { useReducer, useState } from 'react';
import {
  BrowserRouter as Router,
  Route
 } from 'react-router-dom';
import { UserReducer } from "./reducers/UserReducer";
import { UserContext } from "./context/UserContext";
import Auth from './screens/Auth';
import Logout from './screens/Logout';
import { StravaConnect } from './screens/StravaConnect';
import { StravaToken } from './screens/StravaToken';
import { StravaData } from './screens/StravaData';
import firebase from 'firebase/app';
import axios from 'axios';
import 'firebase/auth';

import config from './config';

const App = () => {
  
  const initialUserState = {
    user: null,
    strava: null,
  };
  const [userChecked, setUserChecked] = useState(false);
  const [appInit, setAppInit] = useState(false);

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

  if (!userChecked) {
    // check for logged in user with firebase once
    firebase.auth().onAuthStateChanged(signedInUser => {
      if (signedInUser) {
        signedInUser.getIdToken().then(idToken => {
          const user = { details: signedInUser, idToken };
          userDispatch({ type: "CHECK_LOGIN_SUCCESS", user });
        }).catch(e => {
          console.log(`Failed to get id token, requests will fail, ${e}`);
          userDispatch({ type: "CHECK_LOGIN_FAIL" });
        });
      } else {
        userDispatch({ type: "CHECK_LOGIN_FAIL" });
      }
      setUserChecked(true);
    });
  }

  const renderAuth = () => {
    return (
      <div>
        <div>Cycle Saver</div>
        <Auth />
      </div>
    );
  }

  return (
    <UserContext.Provider value={[userState, userDispatch]}>
      {userState.user ?
        <>
          <Router>
            <Logout />
            <div>
              <div>Cycle Saver</div>
              <div>See how much you save by running, walking or cycling to work. (N+1)</div>
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
          </Router>
        </>
        :
        <>
          {renderAuth()}
        </>
      }
    </UserContext.Provider>
  );
}

export default App;