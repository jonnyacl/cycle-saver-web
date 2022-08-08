import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { extractQueries } from '../helpers';
import * as auth from 'firebase/auth';
import { useUser } from '../hooks/useUser';

export const SignupConfirm = () => {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const { user } = useUser();

  const nav = useNavigate();
  const location = useLocation();

  const queries = extractQueries(location.search);

  useEffect(() => {
    if (user?.emailVerified) {
      console.log('Email already verified');
      nav('/');
    } else if (!user?.emailVerified && queries.email) {
      auth
        .signInWithEmailLink(
          auth.getAuth(),
          queries.email,
          window.location.href
        )
        .then(() => {
          setLoading(false);
          nav('/?confirm=success');
        })
        .catch((err) => {
          console.error(err);
          setErrorMessage(`Failed to confirm email. ${err}`);
          setLoading(false);
          nav('/?confirm=fail');
        });
    } else {
      setLoading(false);
    }
  }, [user, nav, queries.email]);

  if (loading) {
    return <></>;
  } else if (errorMessage) {
    return <div>{errorMessage}</div>;
  }
  return <div>Failed to confirm email. Please contact support.</div>;
};
