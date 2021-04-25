/* eslint-disable jsx-a11y/img-redundant-alt */
import { useState, useEffect, useContext } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import { isUserFollowingProfile, toggleFollow } from '../../services/firebase';
import { UserContext } from '../../context/user';

const Header = ({
  photosCount,
  followerCount,
  setFollowerCount,
  profile: {
    docId: profileDocId,
    userId: profileUserId,
    fullName,
    followers,
    following,
    username: profileUsername,
    avatar,
  },
}) => {
  const { user } = useContext(UserContext);
  const [isFollowingProfile, setIsFollowingProfile] = useState(false);
  const activeBtnFollow = user?.username && user?.username !== profileUsername;

  const handleToggleFollow = async () => {
    setIsFollowingProfile((isFollowing) => !isFollowing);
    setFollowerCount({
      followerCount: isFollowingProfile ? followerCount - 1 : followerCount + 1,
    });
    await toggleFollow(
      isFollowingProfile,
      user.docId,
      profileDocId,
      profileUserId,
      user.userId
    );
  };

  useEffect(() => {
    const isLoggedInUserFollowingProfile = async () => {
      const isFollowing = await isUserFollowingProfile(
        user.username,
        profileUserId
      );
      setIsFollowingProfile(!!isFollowing);
    };

    if (user?.username && profileUserId) {
      isLoggedInUserFollowingProfile();
    }
  }, [user?.username, profileUserId]);

  return (
    <div className="flex justify-evenly mx-auto max-w-screen-lg">
      <div className="flex flex-col justify-center items-center ml-2">
        <img
          className="rounded-full md:h-40 md:w-40 h-28 w-28 flex"
          alt={`${profileUsername}'s profile picture`}
          src={avatar}
        />
      </div>
      <div className="flex items-center justify-center flex-col">
        <div className="container flex items-center">
          <p className="md:text-2xl text-xl mr-4">{profileUsername}</p>
          {activeBtnFollow && (
            <button
              className="bg-blue-medium hover:bg-blue-light font-bold text-sm rounded text-white w-20 h-8 transition-colors duration-200"
              type="button"
              onClick={handleToggleFollow}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleToggleFollow();
                }
              }}
            >
              {isFollowingProfile ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
        <div className="container flex mt-4">
          {!followers || !following ? (
            <Skeleton count={1} width={677} height={24} />
          ) : (
            <>
              <div className="flex flex-col md:flex-row justify-center items-center md:mr-10 mr-4">
                <span className="font-bold md:mr-2">{photosCount}</span>
                <p className="md:text-base text-xs">posts</p>
              </div>
              <div className="flex flex-col md:flex-row justify-center items-center md:mr-10 mr-4">
                <span className="font-bold md:mr-2">{followerCount}</span>
                <p className="md:text-base text-xs">
                  {followerCount === 1 ? `follower` : `followers`}
                </p>
              </div>
              <div className="flex flex-col md:flex-row justify-center items-center md:mr-10 mr-4">
                <span className="font-bold md:mr-2">{following?.length}</span>
                <p className="md:text-base text-xs">following</p>
              </div>
            </>
          )}
        </div>
        <div className="container mt-4">
          <p className="font-medium">
            {!fullName ? <Skeleton count={1} height={24} /> : fullName}
          </p>
        </div>
        <Link to={`/p/${profileUserId}/edit`} className="mr-auto">
          <button
            type="button"
            className="border rounded border-gray-primary px-4 py-1 mt-4 hover:bg-black-faded hover:text-white transition-colors duration-200"
          >
            Edit Profile
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
