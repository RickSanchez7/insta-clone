import { useParams, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUserByUserId } from '../services/firebase';
import * as ROUTES from '../constants/routes';
import UserProfile from '../components/profile';

export default function Profile() {
  const { id: userId } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const history = useHistory();

  useEffect(() => {
    async function checkUserExists() {
      const [user] = await getUserByUserId(userId);
      if (user?.userId) {
        setUserProfile(user);
      } else {
        history.push(ROUTES.NOT_FOUND);
      }
    }

    checkUserExists();
  }, [userId, history]);

  useEffect(() => {
    document.title = 'Profile - Insta';
  }, []);

  return userProfile?.username ? (
    <div className="bg-gray-background dark:bg-black-light">
      <div className="mx-auto max-w-screen-lg">
        <UserProfile user={userProfile} />
      </div>
    </div>
  ) : null;
}
