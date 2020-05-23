import React, { useContext, useState } from 'react';
import axios from 'axios';
import { UserContext } from "../context/UserContext";
import { extractQueries } from '../helpers';
import { useHistory } from 'react-router-dom';
import { StravaConnect } from '../components/StravaConnect';

export const StravaToken = () => {

    const [userState, dispatch] = useContext(UserContext);
    const history = useHistory();

    const queries = extractQueries(history.location.search);

    const failedToConnect = (eMessage) => {
        return (
            <div>
                Failed to connect to Strava{eMessage}. Please try again if you wish to see how much you are saving (earning)!
                <StravaConnect />
            </div>
        );
    }

    if (queries.error) {
        let eMessage = `: ${queries.error}`;
        if (queries.error === "access_denied") {
            eMessage = ". You may have clicked cancel"
        }
        return failedToConnect(eMessage);
        
    } else if (queries.code) {
        // obtain a token!
        console.log(`Obtaining a token with code ${queries.code}`);
        axios.post("strava/token", { code: queries.code, user_id: userState.user.uid }).then(resp => {
            console.log(`Connected to strava: ${JSON.stringify(resp.data)}`);
            dispatch({ type: "STRAVA_TOKEN_SUCCESS" });
            history.push("?status=success");
        }).catch(e => {
            console.error('Failed to obtain strava token', e);
            dispatch({ type: "STRAVA_TOKEN_FAIL" });
            history.push("?status=fail");
        });
    } else if (queries.status) {
        if (queries.status === "success") {
            return <div>Connected to Strava!</div>;
        } else {
            return failedToConnect();
        }
    }

    return null;
};