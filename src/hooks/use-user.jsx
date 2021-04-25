import { useState, useEffect } from 'react';
import { getUserByUserId } from '../services/firebase';

const useUser = (userId) => {
  const [activeUser, setActiveUser] = useState('');

  useEffect(() => {
    const getUserObjByUserId = async (id) => {
      const [user] = await getUserByUserId(id);
      if (user) {
        setActiveUser(user);
      }
    };

    if (userId) {
      getUserObjByUserId(userId);
    }

    return () => getUserByUserId();
  }, [userId]);

  return { user: activeUser, setActiveUser };
};

export default useUser;
