import React from 'react';
import { Routes } from './routes';
import { UserProvider } from './hooks/useUser';
import './App.scss';

const App = () => {
  return (
    <UserProvider>
      <Routes />
    </UserProvider>
  );
};

export default App;
