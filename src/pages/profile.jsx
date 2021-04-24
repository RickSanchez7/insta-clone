import { useParams, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUserByUsername } from '../services/firebase';
import * as ROUTES from '../constants/routes';
import UserProfile from '../components/profile';

export default function Profile() {
  const { username } = useParams();
  const [userProfile, setUserProfile] = useState(null);
  const history = useHistory();

  useEffect(() => {
    async function checkUserExists() {
      const [user] = await getUserByUsername(username);
      if (user?.userId) {
        setUserProfile(user);
      } else {
        history.push(ROUTES.NOT_FOUND);
      }
    }

    checkUserExists();
  }, [username, history]);

  return userProfile?.username ? (
    <div className="bg-gray-background">
      <div className="mx-auto max-w-screen-lg">
        <UserProfile user={userProfile} />
      </div>
    </div>
  ) : null;
}
