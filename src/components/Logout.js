import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import firebase from 'firebase/app';
import 'firebase/auth';

const Logout = () => {

    const [, dispatch] = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);

    const logout = () => {
        setIsLoading(true);
        firebase.auth().signOut().then(() => {
            setIsLoading(false);
            dispatch({ type: "LOGOUT_SUCCESS" });
        }).catch(e => {
            console.error(`Failed to logout properly: ${e}`);
            setIsLoading(false);
            dispatch({ type: "LOGOUT_FAIL" });
        })
    };

    if (isLoading) {
        return (<div className="app-nav-action">Logging out...</div>);
    }
    return (
        <div className="app-nav-action" onClick={() => {logout()}}>Logout</div>
    );
}

export default Logout;