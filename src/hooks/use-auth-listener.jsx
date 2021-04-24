import { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../context/firebase';

const useAuthListener = () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const { firebase } = useContext(FirebaseContext);

  useEffect(() => {
    const listener = firebase.auth().onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return listener;
  }, []);

  return { user, loading };
};

export default useAuthListener;
