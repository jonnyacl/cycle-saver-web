import React, { useContext } from 'react';
import { StravaConnect } from '../components/StravaConnect';
import { UserContext } from '../context/UserContext';

const Profile = () => {

    const [userState] = useContext(UserContext);

    const profile = userState.user;
    const stravaProfile = userState && userState.strava && userState.strava.profile? userState.strava.profile : null;
    console.log('strava profile', stravaProfile);
    return (
        <>
            <h3>Profile</h3>
            {stravaProfile && (
                <>
                    <h3>{stravaProfile.firstname} {stravaProfile.lastname}</h3>
                    <img src={stravaProfile.profile} alt="profile_pic"/>
                </>
            )}
            <div>Email: {profile.email}</div>
            {stravaProfile ? (
                <>
                    <div>Country: {stravaProfile.country}</div>
                    <div>City: {stravaProfile.city}</div>
                </>
            ) : <StravaConnect />}
        </>
    );
};

export default Profile;