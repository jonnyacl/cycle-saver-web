import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from "../context/UserContext";
import ApiCaller from '../api/ApiWrapper';
import moment from 'moment';
import { useHistory } from 'react-router-dom';

export const StravaActivity = () => {

    const [userState, dispatch] = useContext(UserContext);
    const [activity, setActivity] = useState(null);
    const [loading, setLoading] = useState(true);
    const history = useHistory();

    const actId = history.location.pathname && history.location.pathname.split('activity/')[1];

    useEffect(() => {
        if (actId) {
            if (userState && userState.strava && userState.strava.activities && userState.strava.activities.length) {
                const act = userState.strava.activities.filter(a => a.id === Number(actId))[0];
                if (act) {
                    setLoading(false);
                    setActivity(act);
                }
            } else {
                // fetch activities
                const { user } = userState;
                const actReq = new ApiCaller(`/${user.uid}/activities`, "get");
                actReq.execute().then(activities => {
                    dispatch({ type: 'STRAVA_ACTIVITY_SUCCESS', activities });
                    const act = activities.filter(a => a.id === Number(actId))[0];
                    if (act) {
                        setLoading(false);
                        setActivity(act);
                    }
                }).catch(err => {
                    console.error(`Failed to fetch user ${user.uid}'s activities`, err);
                    setLoading(false);
                });
            }
        } else {
            setLoading(false);
        }
        // eslint-disable-next-line
    }, [actId]);

    
    if (activity) {
        console.log('Activity', activity);
        return (
            <div>
                <h3>{activity.name}</h3>
            </div>
        );
    }
    if (loading) {
        return (<div>Loading...</div>);
    }

    return (
        <div>Invalid Activity ID</div>
    );

    
};