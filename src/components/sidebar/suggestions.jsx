/* eslint-disable no-nested-ternary */
import { useState, useEffect } from 'react';
import Skeleton from 'react-loading-skeleton';
import { getSuggestedProfiles } from '../../services/firebase';
import SuggestedProfile from './suggested-profile';

const Suggestions = ({ userId, following, loggedInUserDocId }) => {
  const [profiles, setProfiles] = useState(null);

  useEffect(() => {
    const suggestedProfiles = async () => {
      const response = await getSuggestedProfiles(userId, following);
      setProfiles(response);
    };

    if (userId) {
      suggestedProfiles();
    }
  }, [userId]);

  return !profiles ? (
    <Skeleton count={1} height={150} className="mt-5" />
  ) : profiles.length > 0 ? (
    <div className="rounded flex flex-col justify-between">
      <div className="md:text-base text-xs flex justify-center mb-2">
        <p className="font-bold md:flex hidden text-gray-base dark:text-white">
          Suggestions for you
        </p>
      </div>
      <div className="md:mt-4 mt-2 md:grid flex md:gap-5 fixed md:relative bg-white dark:bg-black-light md:bg-gray-background bottom-0 right-0 left-0 md:border-t-0 border-t border-black-faded dark:border-white overflow-auto">
        {profiles.map((profile) => (
          <SuggestedProfile
            key={profile.docId}
            profileDocId={profile.docId}
            username={profile.username}
            profileId={profile.userId}
            userId={userId}
            loggedInUserDocId={loggedInUserDocId}
            avatar={profile.avatar}
          />
        ))}
      </div>
    </div>
  ) : null;
};

export default Suggestions;
