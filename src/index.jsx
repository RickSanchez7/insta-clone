import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { FirebaseContext } from './context/firebase';
import { AuthProvider } from './context/logged-in-user';
import { FieldValue, firebase } from './lib/firebase';
import './styles/app.css';

ReactDOM.render(
  <React.StrictMode>
    <FirebaseContext.Provider value={{ firebase, FieldValue }}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </FirebaseContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
