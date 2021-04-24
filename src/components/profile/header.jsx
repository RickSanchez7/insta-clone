/* eslint-disable jsx-a11y/img-redundant-alt */
import { useState, useEffect, useContext } from 'react';
import Skeleton from 'react-loading-skeleton';
import {
  isUserFollowingProfile,
  toggleFollow,
  updateAvatar,
} from '../../services/firebase';
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

  const [previewPhoto, setPreviewPhoto] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

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

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewPhoto(reader.result);
    };
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files;

    const types = ['image/png', 'image/jpeg'];
    if (!types.includes(file[0].type)) {
      return;
    }
    previewFile(file[0]);
    setImage(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return;
    const data = new FormData();
    data.append('file', image[0]);
    data.append('upload_preset', 'insta-profile');
    setLoading(true);
    const res = await fetch(
      'https://api.cloudinary.com/v1_1/drqvkgn34/image/upload',
      {
        method: 'POST',
        body: data,
      }
    );
    const file = await res.json();

    await updateAvatar(file.secure_url, user?.docId);
    setImage('');
    setPreviewPhoto(file.secure_url);
    setLoading(false);
  };

  return (
    <div className="flex justify-evenly mx-auto max-w-screen-lg">
      <div className="flex flex-col justify-center items-center ml-2">
        {previewPhoto ? (
          <img
            className="rounded-full md:h-40 md:w-40 h-28 w-28 flex"
            alt={`${fullName} profile picture`}
            src={previewPhoto}
          />
        ) : (
          <img
            className="rounded-full md:h-40 md:w-40 h-28 w-28 flex"
            alt={`${profileUsername}'s profile picture`}
            src={avatar}
          />
        )}
        {profileUserId === user?.userId && (
          <div className="flex md:flex-row md:items-center flex-col mt-2">
            <label className="flex items-center justify-center md:w-10 md:h-10 h-6 w-6 border border-red-primary text-red-primary rounded-full md:text-3xl text-xl hover:text-white hover:bg-red-primary cursor-pointer mx-auto">
              <input
                className="opacity-0 h-0 w-0"
                type="file"
                name="file"
                onChange={handleFileInputChange}
              />
              <span className="md:mb-2 mb-1">+</span>
            </label>
            {previewPhoto && (
              <button
                type="button"
                onClick={handleUpload}
                className="md:text-sm text-xs md:mt-0 mt-2 ml-0 md:ml-2 hover:text-red-primary self-center"
              >
                {loading ? 'loading...' : 'Change'}
              </button>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center justify-center flex-col">
        <div className="container flex items-center">
          <p className="md:text-2xl text-xl mr-4">{profileUsername}</p>
          {activeBtnFollow && (
            <button
              className="bg-blue-medium font-bold text-sm rounded text-white w-20 h-8"
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
                <p className="md:text-base text-xs">photos</p>
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
      </div>
    </div>
  );
};

export default Header;
