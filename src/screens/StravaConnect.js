import React, { useState } from 'react';
import axios from 'axios';

export const StravaConnect = ({ user }) => {

    const [isLoading, setIsLoading] = useState(false);

    const connectStrava = () => {
        setIsLoading(true);
        console.log("Connecting to Strava...");
        axios.post("strava/oauth", { env: "web", user_id: user.uid }).then(resp => {
            console.log(`Connecting to strava: ${JSON.stringify(resp.data)}`);
            setIsLoading(false);
            if (resp.data.url) {
                window.location = resp.data.url;
            }
        }).catch(e => {
            console.log(`Error connecting to strava: ${e.message}`);
            console.log(`REsp: ${JSON.stringify(e.response)}`);
            setIsLoading(false);
        });
    }

    if (isLoading) {
        return (
            <button disabled={true}>Connecting...</button>
        );
    }
    return (
       <button onClick={() => connectStrava()}>Connect Strava</button>
    );
};