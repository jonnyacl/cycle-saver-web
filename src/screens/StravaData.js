import React, { useState, useContext } from 'react';
import { UserContext } from "../context/UserContext";
import { StravaConnect } from "../components/StravaConnect";
import ApiCaller from '../api/ApiWrapper';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import '../styles/web/activities.scss';

export const StravaData = () => {

    const [userState, dispatch] = useContext(UserContext);
    const history = useHistory();

    const [isLoading, setIsLoading] = useState(userState.strava && !userState.strava.activities);

    if (userState && userState.user && userState.strava && !userState.strava.activities) {
        // fetch strava data
        const { user } = userState;
        const actReq = new ApiCaller(`/${user.uid}/activities`, "get");
        actReq.execute().then(activities => {
            dispatch({ type: 'STRAVA_ACTIVITY_SUCCESS', activities });
        }).catch(err => {
            console.error(`Failed to fetch user ${user.uid}'s activities`, err);
            setIsLoading(false);
        });
    }

    if (isLoading) {
        return (
            <div>Loading...</div>
        );
    }
    const stravaProfile = userState && userState.strava && userState.strava.profile? userState.strava.profile : null;
    const stravaActs = userState && userState.strava && userState.strava.activities ? 
        userState.strava.activities.sort((a, b) => {
            return moment(b.start_date_local).diff(moment(a.start_date_local));
        }) : [];
    if (stravaProfile) {
        console.log('Athlete', stravaProfile);
    }
    if (stravaActs) {
        console.log('Activities', stravaActs);
    }
    if (stravaProfile) {
        return (
            <div className="strava_data">
                <div className="welcome">
                    Welcome {stravaProfile.firstname}
                </div>
                {stravaActs && (
                    <ul>
                        {stravaActs.map((act) => {
                            return (
                                <li className="strava_act" key={act.id} onClick={() => { history.push(`/activity/${act.id}`)}}>
                                    {moment(act.start_date_local).format('DD/MM/YY')}: {act.name}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div> 
        );
    }
    if (userState) {
        return (
            <div>
                <div>See how much you save by running, walking or cycling to work. N+1</div>
                <div>
                    First, please connect your Strava account so we can analyse your commutes to calculate your savings.
                </div>
                <StravaConnect />
            </div>
        );
    }
    return null;
};