import React, { useState, useContext } from 'react';
import stravaButton from '../resources/images/stravaConnect.png';
import ApiCaller from '../api/ApiWrapper';
import { UserContext } from '../context/UserContext';

export const StravaConnect = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [userState] = useContext(UserContext);

    const user = userState ? userState.user : null;

    const connectStrava = () => {
        setIsLoading(true);
        console.log("Connecting to Strava...");
        const apiReq = new ApiCaller("strava/oauth", "post");
        apiReq.execute({ env: "web", user_id: user.uid }).then(resp => {
            console.log(`Connecting to strava: ${JSON.stringify(resp)}`);
            setIsLoading(false);
            if (resp.url) {
                window.location = resp.url;
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

    if (isLoading) {
        return (
            <div>
                <img className="clickable" src={stravaButton} alt="strava_connecting"/>
            </div>
        );
    }
    return (
        <div>
            <img className="clickable" src={stravaButton} alt="strava_connect" onClick={() => connectStrava()}/>
            {errorMessage ? 
                <div>{errorMessage}</div>
            : null}
        </div>
    );
};