import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Profile = () => {

    const history = useHistory();
    const [userState, dispatch] = useContext(UserContext);

    const takeMeHome = () => {
        history.push("/");
    };

    return (
        <div>Profile</div>
    );

};

export default Profile;