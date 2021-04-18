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
        <p className="font-bold text-gray-base">Suggestions for you</p>
      </div>
      <div className="md:mt-4 mt-2 grid gap-5">
        {profiles.map((profile) => (
          <SuggestedProfile
            key={profile.docId}
            profileDocId={profile.docId}
            username={profile.username}
            profileId={profile.userId}
            userId={userId}
            loggedInUserDocId={loggedInUserDocId}
          />
        ))}
      </div>
    </div>
  ) : (
    <p>No suggestions</p>
  );
};

export default Suggestions;
