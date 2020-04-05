import React from 'react';
import Logout from './Logout';
import { useHistory } from 'react-router-dom';

const Nav = ({user}) => {

    const history = useHistory();

    const takeMeHome = () => {
        history.push("/");
    };

    const profile = () => {
        history.push("/profile");
    };

    const settings = () => {
        history.push("/settings");
    };

    return (
        <nav className="app-header">
            <div className="app-title" onClick={() => takeMeHome()}>
                <span className="material-icons">directions_bike</span>
                <span>Cycle Saver</span>
            </div>
            {user && user.user &&
                <div>
                    <div className="app-nav-action" onClick={() => profile()}>Profile</div>
                    <div className="app-nav-action"onClick={() => settings()}>Settings</div>
                    <Logout />
                </div>
            }
        </nav>
    );

};

export default Nav;