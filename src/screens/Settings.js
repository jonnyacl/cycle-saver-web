import React, { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from '../context/UserContext';
import Modal from '../components/Modal';
import ApiCaller from '../api/ApiWrapper';
import { StravaConnect } from '../components/StravaConnect';

const Profile = () => {

    const [userState, dispatch] = useContext(UserContext);
    const [modal, setModal] = useState(null);
    const settingsRef = useRef();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const profile = userState.user;
    const stravaProfile = userState && userState.strava && userState.strava.profile? userState.strava.profile : null;

    useEffect(() => {
        console.log('strava profile', stravaProfile);
    }, [stravaProfile]);

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
    
    const cancel = (e) => {
        if (e && e.target && !e.target.contains(settingsRef.current)) {
            return;
        }
        setModal(null);
        setErrorMessage("");
        setIsLoading(false);
    };

    const handleRevoke = () => {
        setIsLoading(true);
        switch(modal.type) {
            case "disconnect":
                const disconnectCall = new ApiCaller(`/${profile.uid}/${modal.source}/deauthorize`, "POST");
                disconnectCall.execute().then(() => {
                    setIsLoading(false);
                    dispatch({ type: `${modal.source.toUpperCase()}_DISCONNECT` });
                }).catch(e => {
                    console.error(`Failed to disconnect ${modal.source}`, e);
                    setErrorMessage(`Failed to disconnect ${modal.source}`);
                    setIsLoading(false);
                });
                break;
            case "delete":
                setIsLoading(false);
                break;
            default:
                setIsLoading(false);
                break;
        }
    };

    const modalContent = () => {
        if (modal && modal.type && modal.type === "delete") {
            return (<div>Are you sure you want to delete your Cycle Saver account?</div>);
        } else if (modal && modal.type && modal.type === "disconnect") {
            return (<div>Are you sure you want to disconnect your {modal.source} account?</div>);
        }
        return null;
    };
        

    return (
        <div className={modal ? "Settings-hide" : "Settings"} ref={settingsRef} >
            <h3>Settings</h3>
            <div>User ID: {profile.uid}</div>
            <div>Email: {profile.email}</div>
            <button onClick={() => onClickDelete()}>Delete Account</button>
            <h4>Integrations</h4>
            {stravaProfile ? (
                <>
                    <h5>Strava</h5>
                    <div>Athlete ID: {stravaProfile.id}</div>
                    <div>Username: {stravaProfile.username}</div>
                    <button onClick={() => onClickDisconnect("strava")}>Disconnect Strava</button>
                </>
            ) : <StravaConnect />}
            <Modal 
                show={!!modal}
                className="SettingsModal"
                content={modalContent()}
                onHide={cancel}
                onConfirm={handleRevoke}
                isLoading={isLoading}
                errorMessage={errorMessage}
            />
        </div>
    );

};

export default Profile;