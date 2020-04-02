import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from "../context/UserContext";

export const StravaData = () => {

    const [userState, dispatch] = useContext(UserContext);
    const [stravaRequested, setStravaRequested] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    if (userState.strava && useState.strava.connected && !stravaRequested) {
        // fetch strava
        setStravaRequested(true);

    }
   
    const connectStrava = () => {
        setIsLoading(true);
        console.log("Connecting to Strava...");
        axios.post("strava/oauth", { env: "web" }).then(resp => {
            console.log(`Connecting to strava: ${JSON.stringify(resp.data)}`);
            setIsLoading(false);
            if (resp.data.url) {
                window.location = resp.data.url;
            }
        }).catch(e => {
            console.error(`Error connecting to strava: ${e.message}`);
            if (e.response) {
                console.error(`Resp: ${e.response}`);
            }
            setIsLoading(false);
        });
    }

    if (isLoading) {
        return (
            <button disabled={true}>Connecting...</button>
        );
    }
    return null;
};