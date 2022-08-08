import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Profile from '../screens/Profile';
import Settings from '../screens/Settings';
import Nav from '../components/Nav';

export const SignedInRoutes = () => {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path='/' element={<Profile />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/settings' element={<Settings />} />
      </Routes>
    </Router>
  );
};
