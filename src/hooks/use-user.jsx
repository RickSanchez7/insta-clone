import { useState, useEffect } from 'react';
import { getUserByUserId } from '../services/firebase';

const useUser = (userId) => {
  const [activeUser, setActiveUser] = useState('');

  useEffect(() => {
    const getUserObjByUserId = async (id) => {
      const user = await getUserByUserId(id);
      if (user) {
        setActiveUser(user[0]);
      }

      // return () => getUserByUserId();
    };

    if (userId) {
      setTimeout(() => {
        getUserObjByUserId(userId);
      }, 500);
    }
  }, [userId]);

  return { user: activeUser, setActiveUser };
};

export default useUser;
