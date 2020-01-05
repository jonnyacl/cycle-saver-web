import React, { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { auth } from "firebase";

const Logout = () => {

    const [userState, dispatch] = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);

    const logout = () => {
        setIsLoading(true);
        auth().signOut().then(() => {
            setIsLoading(false);
            dispatch({ type: "LOGOUT_SUCCESS" });
        }).catch(e => {
            console.log(`Failed to logout properly: ${e}`);
            setIsLoading(false);
            dispatch({ type: "LOGOUT_FAIL" });
        })
    };

    if (isLoading) {
        return (<button>Logging out...</button>);
    }
    return (
        <button onClick={() => {logout()}}>Logout</button>
    );
}

export default Logout;