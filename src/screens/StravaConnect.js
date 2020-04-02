import React, { useState } from 'react';
import axios from 'axios';
import stravaButton from '../resources/images/stravaConnect.png';
import '../styles/buttons.css';

export const StravaConnect = ({ user }) => {

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

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
            const message = `Error connecting to strava: ${e.message}`;
            console.error(message);
            if (e.response) {
                console.error(`Resp: ${JSON.stringify(e.response)}`);
            }
            setErrorMessage(message);
            setIsLoading(false);
        });
    }

    const renderStravaMessage = ( )=> {
        return(
            <div>
                First, please connect your Strava account so we can analyse your commutes to calculate your savings.
            </div>
        );
    }

    if (isLoading) {
        return (
            <div>
                {renderStravaMessage()}
                <img className="clickable" src={stravaButton} alt="strava_connecting"/>
            </div>
        );
    }
    return (
        <div>
            {renderStravaMessage()}
            <img className="clickable" src={stravaButton} alt="strava_connect" onClick={() => connectStrava()}/>
            {errorMessage ? 
                <div>{errorMessage}</div>
            : null}
        </div>
    );
};