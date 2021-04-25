import { useState, useEffect, useContext, createContext } from 'react';
import { firebase } from '../lib/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const listener = firebase.auth().onAuthStateChanged((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => listener();
  }, []);

  const value = {
    user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
