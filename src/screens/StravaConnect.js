import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';

export const StravaConnect = ({ user }) => {

    const [isLoading, setIsLoading] = useState(false);
    if (config.env.toLowerCase() === "dev") {
        axios.defaults.baseURL = "http://localhost:5000/cycle-saver/us-central1/app/";
    } else {
        axios.defaults.baseURL = "https://us-central1-cycle-saver.cloudfunctions.net/app/";
    }
    axios.defaults.headers["Authorization"] = `Bearer ${user.idToken}`;
    
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
            console.log(`Error connecting to strava: ${e.message}`);
            setIsLoading(false);
        });
    }

    if (isLoading) {
        return (
            <button>Connecting...</button>
        );
    }
    return (
       <button onClick={() => connectStrava()}>Connect Strava</button>
    );
};