import React from 'react';
import { StravaConnect } from '../components/StravaConnect';
import { useUser } from '../hooks/useUser';

const Profile = () => {
  const { user } = useUser();
  const stravaProfile = user?.strava?.athlete;
  console.log('strava profile', stravaProfile);
  return (
    <>
      <h3>Profile</h3>
      {stravaProfile && (
        <>
          <h3>
            {stravaProfile.firstname} {stravaProfile.lastname}
          </h3>
          {stravaProfile.profile && (
            <img src={stravaProfile.profile} alt='profile_pic' />
          )}
        </>
      )}
      <div>Email: {user?.email}</div>
      {stravaProfile ? (
        <>
          <div>Country: {stravaProfile.country}</div>
          <div>City: {stravaProfile.city}</div>
        </>
      ) : (
        <StravaConnect />
      )}
    </>
  );
};

export default Profile;
