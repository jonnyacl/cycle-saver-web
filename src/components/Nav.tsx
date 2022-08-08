import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logout } from './Logout';

const Nav = () => {
  const nav = useNavigate();

  const takeMeHome = useCallback(() => {
    nav('/');
  }, [nav]);

  const profile = useCallback(() => {
    nav('/profile');
  }, [nav]);

  const settings = useCallback(() => {
    nav('/settings');
  }, [nav]);

  return (
    <nav className='app-header'>
      <div className='app-title' onClick={takeMeHome}>
        <span className='material-icons'>directions_bike</span>
        <span>Cycle Saver</span>
      </div>
      <div>
        <div className='app-nav-action' onClick={profile}>
          Profile
        </div>
        <div className='app-nav-action' onClick={settings}>
          Settings
        </div>
        <Logout />
      </div>
    </nav>
  );
};

export default Nav;
