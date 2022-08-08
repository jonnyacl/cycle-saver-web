import React, { useState, useContext } from 'react';
import { StravaConnect } from '../components/StravaConnect';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import '../styles/web/activities.scss';
import { useUser } from '../hooks/useUser';

export const StravaData = () => {
  const { user } = useUser();
  const nav = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  // const query = useGraphQuery({});

  if (isLoading) {
    return <div>Loading...</div>;
  }
  const stravaProfile = user?.strava?.athlete;

  if (stravaProfile) {
    console.log('Athlete', stravaProfile);
  }
  if (stravaProfile) {
    return (
      <div className='strava_data'>
        <div className='welcome'>Welcome {stravaProfile.firstname}</div>
        {/* {stravaActs && (
          <ul>
            {stravaActs.map((act) => {
              return (
                <li
                  className='strava_act'
                  key={act.id}
                  onClick={() => {
                    nav(`/activity/${act.id}`);
                  }}
                >
                  {moment(act.start_date_local).format('DD/MM/YY')}: {act.name}
                </li>
              );
            })}
          </ul>
        )} */}
      </div>
    );
  }
  if (user) {
    return (
      <div>
        <div>
          See how much you save by running, walking or cycling to work. N+1
        </div>
        <div>
          First, please connect your Strava account so we can analyse your
          commutes to calculate your savings.
        </div>
        <StravaConnect />
      </div>
    );
  }
  return null;
};
