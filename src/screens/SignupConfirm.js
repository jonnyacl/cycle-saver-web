import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from "../context/UserContext";
import { useHistory } from 'react-router-dom';
import { extractQueries } from '../helpers';
import firebase from 'firebase/app';
import 'firebase/auth';

export const SignupConfirm = () => {

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [userState] = useContext(UserContext);

    const history = useHistory();

    const queries = extractQueries(history.location.search);
    console.log(userState);

    useEffect(() => {
        if (userState && userState.user && userState.user.emailVerified) {
            console.log('Email already verified');
            history.push("/");
        } else if (userState && userState.user && !userState.user.emailVerified && queries.email) {
            firebase.auth().signInWithEmailLink(queries.email, window.location.href).then(() => {
                setLoading(false);
                history.push("/?confirm=success");
            }).catch((err) => {
                console.error(err);
                setErrorMessage(`Failed to confirm email. ${err}`);
                setLoading(false);
                history.push("/?confirm=fail");
            });
        } else {
            setLoading(false);
        }
    }, [userState.user]);
    

    if (loading) {
        return <></>;
    } else if (errorMessage) {
        return (
            <div>
                {errorMessage}
            </div>
        );
    }
    return (
        <div>
            Failed to confirm email. Please contact support.
        </div>
    );
};