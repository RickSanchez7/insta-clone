import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
  updateLoggedInUserFollowing,
  updateFollowedUserFollowers,
  getUserByUserId,
} from '../../services/firebase';
import { UserContext } from '../../context/user';

const SuggestedProfile = ({
  profileDocId,
  username,
  profileId,
  userId,
  loggedInUserDocId,
  avatar,
}) => {
  const [followed, setFollowed] = useState(false);
  const { setActiveUser } = useContext(UserContext);

  const handleFollowUser = async () => {
    setFollowed(true);
    await updateLoggedInUserFollowing(loggedInUserDocId, profileId, false);
    await updateFollowedUserFollowers(profileDocId, userId, false);
    const [user] = await getUserByUserId(userId);
    setActiveUser(user);
  };

  return !followed ? (
    <div className="flex flex-row items-center align-items">
      <div className="flex md:items-center w-full justify-evenly ">
        <Link to={`/p/${username}`}>
          <img
            className="rounded-full w-11 h-11 flex md:mr-3 md:ml-0 ml-3 md:mt-0 mt-2 md:mb-0 mb-2 border border-red-primary"
            src={avatar}
            alt=""
            onError={(e) => {
              e.target.src = `/images/avatars/default.png`;
            }}
          />
        </Link>
        <div className="md:flex hidden md:flex-row flex-col items-center md:justify-between w-full">
          <Link to={`/p/${username}`}>
            <p className="font-bold md:text-base text-sm ml-2">{username}</p>
          </Link>
          <button
            className="md:text-base text-xs font-bold text-blue-medium"
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
