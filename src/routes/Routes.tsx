import { useUser } from '../hooks/useUser';
import React from 'react';
import { SignedInRoutes } from './SignedInRoutes';
import { SignIn } from '../components/SignIn';

export const Routes = () => {
  const signedInUser = useUser();
  if (signedInUser?.loading) {
    return <div>Loading...</div>;
  }

  if (signedInUser.user) {
    return <SignedInRoutes />;
  }
  return <SignIn />;
};
