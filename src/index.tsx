import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './config';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

initializeApp(firebaseConfig);
let apolloUri = `http://localhost:5001/cycle-saver/us-central1/graph/graphql`;
if (process.env.REACT_APP_AUTH_EMULATOR) {
  const auth = getAuth();
  connectAuthEmulator(auth, 'http://localhost:9099');
  apolloUri = 'http://localhost:5001/cycle-saver/us-central1/graph/graphql';
}
const client = new ApolloClient({
  uri: apolloUri,
  cache: new InMemoryCache(),
});
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
