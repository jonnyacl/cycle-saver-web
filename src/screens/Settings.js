import React, { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from '../context/UserContext';
import '../styles/Settings.css';

const Profile = () => {

    const [userState] = useContext(UserContext);
    const [modal, setModal] = useState(null);
    const settingsRef = useRef();

    const profile = userState.user;
    const stravaProfile = userState && userState.strava && userState.strava.profile? userState.strava.profile : null;

    useEffect(() => {
        console.log('strava profile', stravaProfile);
    }, [stravaProfile]);

    useEffect(() => {
        console.log('modal', modal);
    }, [modal]);

    useEffect(() => {
        document.addEventListener("mousedown", cancel);

        return () => {
            document.removeEventListener("mousedown", cancel);
        };
    }, []);

    const onClickDelete = () => {
        console.log("Delete Account Clicked");
        setModal({ type: "delete" });
    };

    const onClickDisconnect = (integration) => {
        console.log(`Disconnect ${integration} Account Clicked`);
        setModal({ type: "disconnect", source: integration });
    };
    
    const cancel = () => {
        setModal(null);
    }

    const handleRevoke = () => {}

    return (
        <div className={modal ? "Settings-hide" : "Settings"}>
            <h3>Settings</h3>
            <div>User ID: {profile.uid}</div>
            <div>Email: {profile.email}</div>
            <button onClick={() => onClickDelete()}>Delete Account</button>
            <h4>Integrations</h4>
            {stravaProfile && (
                <>
                    <h5>Strava</h5>
                    <div>Athlete ID: {stravaProfile.id}</div>
                    <div>Username: {stravaProfile.username}</div>
                    <button onClick={() => onClickDisconnect("strava")}>Disconnect Strava</button>
                </>
            )}
            {modal && (
                <div className="SettingsModal" ref={settingsRef}>
                    <div>
                        <span onClick={() => cancel()}>&times;</span>
                        {modal.type === "delete" ? 
                            <div>Are you sure you want to delete your Cycle Saver account?</div>
                            : <div>Are you sure you want to disconnect your {modal.source} account?</div>
                        }
                        <p />
                        <span onClick={() => handleRevoke()}>Confirm</span>
                    </div>
                </div>
            )}
        </div>
    );

};

export default Profile;