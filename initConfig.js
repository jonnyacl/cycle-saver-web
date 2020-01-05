const prompt = require('prompt');
const fs = require('fs');

var prompt_attributes = [
    'apiKey','appId','messagingSenderId','measurementId','projectId'
];
console.log("Running setup...");
prompt.start();

prompt.get(prompt_attributes, (err, result) => {
    if (err) {
        console.log(err);
        return 1;
    } else {
        var apiKey = result.apiKey && result.apiKey.length > 0 ? result.apiKey : '<replace-with-api-key>';
        var appId = result.appId;
        var messagingSenderId = result.messagingSenderId;
        var measurementId = result.measurementId;
        var projectId = result.projectId;


        var message = "  apiKey : ***, appId : " + appId + ", messagingSenderId: " + messagingSenderId + ", measurementId: " + measurementId;

        const expText = "export default {\n  env: process.env.REACT_APP_ENV,\n  firebaseConfig\n};"

        const fileText = `const firebaseConfig = {\n  apiKey: "${apiKey}",\n  authDomain: "${projectId}.firebaseapp.com",\n  databaseURL: "https://${projectId}.firebaseio.com",\n  storageBucket: "${projectId}.appspot.com",\n  projectId: "${projectId}",\n  messagingSenderId: "${messagingSenderId}",\n  projectId: "${projectId}",\n  appId: "${appId}",\n  projectId: "${projectId}",\n  measurementId: "${measurementId}"\n}\n\n${expText}`;

        fs.writeFile("./src/config.js", fileText, e => {
            if (e) {
                console.log(e);
                return 1;
            }
        }); 

        // Display user input in console log.
        console.log(message);
    }
});