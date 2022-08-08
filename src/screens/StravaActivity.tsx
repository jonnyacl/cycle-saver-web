import React, { useState } from 'react';
import moment from 'moment';
import { useLocation } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

export const StravaActivity = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const actId = location.pathname && location.pathname.split('activity/')[1];

  // const query = useGraphQuery({});

  //   if (activity) {
  //     console.log('Activity', activity);
  //     return (
  //       <div>
  //         <h3>{activity.name}</h3>
  //       </div>
  //     );
  //   }
  if (loading) {
    return <div>Loading...</div>;
  }

  return <div>Invalid Activity ID</div>;
};
