import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { extractQueries } from '../helpers';
import { useNavigate, useLocation } from 'react-router-dom';
import { StravaConnect } from '../components/StravaConnect';
import { useUser } from '../hooks/useUser';

export const StravaToken = () => {
  const nav = useNavigate();
  const location = useLocation();
  const queries = extractQueries(location.search);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();

  useEffect(() => {
    // obtain a token!
    if (queries && queries.code) {
      console.log(`Obtaining a token with code ${queries.code}`);
      axios
        .post('strava/token', {
          code: queries.code,
          user_id: user?.uid,
        })
        .then((resp) => {
          console.log(`Connected to strava: ${JSON.stringify(resp.data)}`);
          setLoading(false);
          nav('/');
        })
        .catch((e) => {
          console.error('Failed to obtain strava token', e);
          setLoading(false);
          nav('?status=fail');
        });
    }
    // eslint-disable-next-line
  }, [queries]);

  if (queries.error) {
    let eMessage = `: ${queries.error}`;
    if (queries.error === 'access_denied') {
      eMessage = '. You may have clicked cancel';
    }
    return (
      <div>
        Failed to connect to Strava{eMessage}. Please try again if you wish to
        see how much you are saving (earning)!
        <StravaConnect />
      </div>
    );
  }
  if (loading) {
    return <div>Connecting strava profile...</div>;
  }
  return null;
};
