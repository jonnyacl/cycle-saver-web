import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { extractQueries } from '../helpers';
import firebase from 'firebase/app';
import 'firebase/auth';

export const SignupConfirm = () => {

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const history = useHistory();

    const queries = extractQueries(history.location.search);
    console.log(queries)

    if (queries.email) {
        firebase.auth().signInWithEmailLink(queries.email, window.location.href).then(res => {
            console.log(res);
            setLoading(false);
            history.push("/?confirm=success");
        }).catch(err => {
            console.error(err);
            setErrorMessage(`Failed to confirm email. ${err}`);
            setLoading(false);
        });
    } else {
        setLoading(false);
    }

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