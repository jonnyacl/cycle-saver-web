import firebase from 'firebase/app';
import axios from 'axios';
import 'firebase/auth';

class ApiCaller {

    constructor(endpoint, method) {
        this.endpoint = endpoint;
        this.method = method;
        this.errored = false;
    }

    execute = (body) => {
        switch(this.method.toUpperCase()) {
            case "GET":
                return new Promise((resolve, reject) => {
                    axios.get(this.endpoint).then(resp => {
                        this.errored = false;
                        resolve(resp.data);
                    }).catch(err => {
                        this.handleError(err, reject);
                    });
                });
            case "POST":
                return new Promise((resolve, reject) => {
                    axios.post(this.endpoint, body).then(resp => {
                        this.errored = false;
                        resolve(resp.data);
                    }).catch(err => {
                        this.handleError(err, reject);
                    });
                });
            default:
                throw new Error(`Invalid HTTP method ${this.method}`);
        }
    };

    handleError = (err, reject) => {
        if (err.status === 401 && !this.errored) {
            // refresh token
            firebase.auth().currentUser.getIdToken().then(token => {
                axios.defaults.headers["Authorization"] = `Bearer ${token}`;
                return this.execute();
            }).catch(e => {
                console.error("Failed to refresh token", e);
                reject(e);
            })
        } else {
            reject(err);
        }
        this.errored = true;
    };

};

export default ApiCaller;