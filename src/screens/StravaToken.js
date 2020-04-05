import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from "../context/UserContext";
import { extractQueries } from '../helpers';
import { useHistory } from 'react-router-dom';
import { StravaConnect } from '../components/StravaConnect';

export const StravaToken = () => {

    const [codeRequested, setCodeRequested] = useState(false);
    const [stravaMessage, setStravaMessage] = useState("");
    const [userState, dispatch] = useContext(UserContext);
    const history = useHistory();

    const queries = extractQueries(history.location.search);

    if (queries.error) {
        let eMessage = `: ${queries.error}`;
        if (queries.error === "access_denied") {
            eMessage = ". You may have clicked cancel"
        }
        return (
            <div>
                Failed to connect Strava{eMessage}. Please try again if you wish to see how much you are saving (earning)!
                <StravaConnect />
            </div>
        );
    } else if (queries.code && !codeRequested) {
        // obtain a token!
        console.log(`Obtaining a token with code ${queries.code}`);
        axios.post("strava/token", { code: queries.code, user_id: userState.user.uid }).then(resp => {
            console.log(`Connected to strava: ${JSON.stringify(resp.data)}`);
            setStravaMessage("Connected to Strava.");
            dispatch({ type: "STRAVA_TOKEN_SUCCESS" });
            setCodeRequested(true);
        }).catch(e => {
            console.error('Failed to obtain strava token', e);
            dispatch({ type: "STRAVA_TOKEN_FAIL" });
            setCodeRequested(true);
        });
    } else if (codeRequested) {
        setStravaMessage("Failed to connect Strava. Please try again if you wish to see how much you are saving (earning)!");
    }

    return (
        <div>
            {stravaMessage}
        </div>
    );
};