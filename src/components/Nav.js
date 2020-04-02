import React from 'react';
import Logout from '../screens/Logout';

const Nav = ({user}) => {

    return(
        <nav className="app-header">
            <span className="material-icons">directions_bike</span>
            Cycle Saver
            {user && user.user ? <Logout className="app-logout"/> : null}
        </nav>
    );

}

export default Nav;