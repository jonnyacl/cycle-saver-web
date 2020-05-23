import React, { useState, useContext } from 'react';
import { UserContext } from "../context/UserContext";
import { StravaConnect } from "../components/StravaConnect";
import ApiCaller from '../api/ApiWrapper';

export const StravaData = () => {

    // eslint-disable-next-line no-unused-vars
    const [userState, dispatch] = useContext(UserContext);
    const [stravaRequested, setStravaRequested] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    if (userState && userState.user && !stravaRequested) {
        // fetch strava data
        const { user } = userState;
        setIsLoading(true);
        setStravaRequested(true);
        const apiReq = new ApiCaller(`/${user.uid}/athletes`, "get");
        apiReq.execute().then(athlete => {
            console.log("Athlete", athlete);
            setIsLoading(false);
        }).catch(e => {
            console.error("No athlete", e);
            setIsLoading(false);
        });
    }

    if (isLoading) {
        return (
            <div>Loading...</div>
        );
    }
    return (
        <div>
            <div>See how much you save by running, walking or cycling to work. N+1</div>
            {userState && userState.strava ? null : userState &&
                <div>
                    <div>
                        First, please connect your Strava account so we can analyse your commutes to calculate your savings.
                    </div>
                    <StravaConnect />
                </div>}
        </div>
    );
};