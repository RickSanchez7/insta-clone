import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_DATABASE_URL,
  storageBucket: process.env.REACT_APP_PROJECT_ID,
  messagingSenderId: process.env.REACT_APP_STORAGE_BUCKET,
  appId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const firebase = Firebase.initializeApp(config);
const { FieldValue } = Firebase.firestore;

export { firebase, FieldValue };
