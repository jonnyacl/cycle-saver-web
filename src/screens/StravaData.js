import React, { useState, useContext } from 'react';
import { UserContext } from "../context/UserContext";
import { StravaConnect } from "../components/StravaConnect";

export const StravaData = () => {

    // eslint-disable-next-line no-unused-vars
    const [userState, dispatch] = useContext(UserContext);
    const [stravaRequested, setStravaRequested] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    if (userState.strava && useState.strava.connected && !stravaRequested) {
        // fetch strava
        setIsLoading(true);
        setStravaRequested(true);
    }

    if (isLoading) {
        return (
            <button disabled={true}>Connecting...</button>
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