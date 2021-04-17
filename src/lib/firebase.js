import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: 'AIzaSyBToPJFOefu1K7VIapzj2lGhGUtTCOoL_w',
  authDomain: 'insta-clone-ad2f5.firebaseapp.com',
  projectId: 'insta-clone-ad2f5',
  storageBucket: 'insta-clone-ad2f5.appspot.com',
  messagingSenderId: '448096449469',
  appId: '1:448096449469:web:4994db12ec390ed9d018d4',
  measurementId: 'G-0MHZ5QDKV9',
};

const firebase = Firebase.initializeApp(config);
const { FieldValue } = Firebase.firestore;

export { firebase, FieldValue };
