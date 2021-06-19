import { useState, useEffect, useContext, createContext } from 'react';
import { firebase } from '../lib/firebase';
import { getUserByUserId } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [loggedUser, setLoggedUser] = useState('');
  const [activeUser, setActiveUser] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const listener = firebase.auth().onAuthStateChanged(async (authUser) => {
      if (authUser) {
        setLoggedUser(authUser);
        const user = await getUserByUserId(authUser.uid);
        setActiveUser(user[0]);
      } else {
        setActiveUser('');
        setLoggedUser('');
      }
      setLoading(false);
    });

    return () => listener();
  }, [firebase]);

  const value = {
    user: loggedUser,
    activeUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
