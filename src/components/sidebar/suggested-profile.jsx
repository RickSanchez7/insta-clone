import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import {
//   updateLoggedInUserFollowing,
//   updateFollowedUserFollowers,
// } from '../../services/firebase';

import {
  updateLoggedInUserFollowing,
  updateFollowedUserFollowers,
  getUserByUserId,
} from '../../services/firebase';
import LoggedInUserContext from '../../context/logged-in-user';

const SuggestedProfile = ({
  profileDocId,
  username,
  profileId,
  userId,
  loggedInUserDocId,
}) => {
  const [followed, setFollowed] = useState(false);
  const { setActiveUser } = useContext(LoggedInUserContext);

  const handleFollowUser = async () => {
    setFollowed(true);
    await updateLoggedInUserFollowing(loggedInUserDocId, profileId, false);
    await updateFollowedUserFollowers(profileDocId, userId, false);
    const [user] = await getUserByUserId(userId);
    setActiveUser(user);
  };

  return !followed ? (
    <div className="flex flex-row items-center align-items">
      <div className="flex items-center w-full justify-evenly">
        <Link to={`/p/${username}`}>
          <img
            className="rounded-full w-8 h-8 flex mr-3"
            src={`/images/avatars/${username}.jpg`}
            alt=""
            onError={(e) => {
              e.target.src = `/images/avatars/default.png`;
            }}
          />
        </Link>
        <div className="flex md:flex-row flex-col items-center md:justify-between w-full">
          <Link to={`/p/${username}`}>
            <p className="font-bold text-sm">{username}</p>
          </Link>
          <button
            className="text-xs font-bold text-blue-medium"
            type="button"
            onClick={handleFollowUser}
          >
            Follow
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default SuggestedProfile;

SuggestedProfile.propTypes = {
  profileDocId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  profileId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  loggedInUserDocId: PropTypes.string.isRequired,
};
