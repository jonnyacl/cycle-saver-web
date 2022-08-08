import { gql, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { QueryGetStravaSignInArgs, StravaSignIn } from '../generated/graphql';
import stravaButton from '../resources/images/stravaConnect.png';

const stravaUrl = gql`
  query GetStravaSignIn {
    getStravaSignIn {
      url
    }
  }
`;

export const StravaConnect = () => {
  const [errorMessage, setErrorMessage] = useState('');

  const { data, loading } = useQuery<
    { getStravaSignIn: StravaSignIn },
    QueryGetStravaSignInArgs
  >(stravaUrl);

  const connectStrava = () => {
    if (data?.getStravaSignIn.url) {
      window.location.href = data.getStravaSignIn.url;
    } else {
      setErrorMessage('Failed to connect to strava');
    }
  };

  if (loading) {
    return (
      <div>
        <img className='clickable' src={stravaButton} alt='strava_connecting' />
        <div>Connecting...</div>
      </div>
    );
  }
  return (
    <div>
      <img
        className='clickable'
        src={stravaButton}
        alt='strava_connect'
        onClick={connectStrava}
      />
      {errorMessage ? <div>{errorMessage}</div> : null}
    </div>
  );
};
