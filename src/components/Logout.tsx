import * as auth from 'firebase/auth';
import React from 'react';

export const Logout = () => {
  return <button onClick={() => auth.signOut(auth.getAuth())}></button>;
};
