import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import firebase from 'firebase/app';
import 'firebase/auth';

const Logout = () => {

    // eslint-disable-next-line no-unused-vars
    const [userState, dispatch] = useContext(UserContext);
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
        return (<button disabled={true}>Logging out...</button>);
    }
    return (
        <button onClick={() => {logout()}}>Logout</button>
    );
}

export default Logout;