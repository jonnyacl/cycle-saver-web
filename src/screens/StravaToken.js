import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from "../context/UserContext";
import { extractQueries } from '../helpers';

export const StravaToken = ({ routerProps }) => {

    const [codeRequested, setCodeRequested] = useState(false);
    const [stravaMessage, setStravaMessage] = useState("");
    const [userState, dispatch] = useContext(UserContext);

    const queries = extractQueries(routerProps.history.location.search);

    if (queries.error) {
        let eMessage = `: ${queries.error}`;
        if (queries.error === "access_denied") {
            eMessage = ". You may have clicked cancel"
        }
        return (
            <div>
                Failed to connect Strava{eMessage}. Please try again if you wish to see how much you are saving (earning)!
            </div>
        );
    } else if (queries.code && !codeRequested) {
        // obtain a token!
        console.log(`Obtaining a token with code ${queries.code}`);
        axios.post("strava/token", { code: queries.code }).then(resp => {
            console.log(`Connected to strava: ${JSON.stringify(resp.data)}`);
            setStravaMessage("Connected to Strava.");
            dispatch({ type: "STRAVA_TOKEN_SUCCESS" });
            setCodeRequested(true);
        }).catch(e => {
            console.log(`Failed to obtain strava token: ${JSON.stringify(e)}`);
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