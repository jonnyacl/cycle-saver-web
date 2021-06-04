import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from "../context/UserContext";
import { extractQueries } from '../helpers';
import { useHistory } from 'react-router-dom';
import { StravaConnect } from '../components/StravaConnect';

export const StravaToken = () => {

    const [userState, userDispatch] = useContext(UserContext);
    const history = useHistory();
    const queries = extractQueries(history.location.search);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // obtain a token!
        if (queries && queries.code) {
            console.log(`Obtaining a token with code ${queries.code}`);
            axios.post("strava/token", { code: queries.code, user_id: userState.user.uid }).then(resp => {
                console.log(`Connected to strava: ${JSON.stringify(resp.data)}`);
                userDispatch({ type: 'STRAVA_CONNECT_SUCCESS', athlete: resp.data });
                setLoading(false);
                history.push("/");
            }).catch(e => {
                console.error('Failed to obtain strava token', e);
                setLoading(false);
                history.push("?status=fail");
            });
        }
    // eslint-disable-next-line
    }, [queries]);

    if (queries.error) {
        let eMessage = `: ${queries.error}`;
        if (queries.error === "access_denied") {
            eMessage = ". You may have clicked cancel"
        }
        return (
            <div>
                Failed to connect to Strava{eMessage}. Please try again if you wish to see how much you are saving (earning)!
                <StravaConnect />
            </div>
        );
    }
    if (loading) {
        return <div>Connecting strava profile...</div>;
    }
    return null;
};