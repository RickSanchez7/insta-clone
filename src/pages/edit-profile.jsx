import React, { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useHistory, useParams } from 'react-router-dom';
import ReactLoader from '../components/loader';
import { firebase } from '../lib/firebase';
import { uploadImage } from '../services/cloudinay';
import {
  updateProfileUsername,
  updateProfileFullName,
  updateProfileImage,
} from '../services/firebase';

function useHasUnmountedRef() {
  const hasUnmountedRef = useRef(false);
  useEffect(() => {
    return () => {
      hasUnmountedRef.current = true;
    };
  }, []);
  return hasUnmountedRef;
}

const EditProfile = () => {
  const { id: profileId } = useParams();
  const history = useHistory();

  const [profileDetails, setProfileDetails] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [profileSaved, setProfileSaved] = useState('');

  // fetch post
  useEffect(() => {
    const fetchProfile = async () => {
      const result = await firebase
        .firestore()
        .collection('users')
        .where('userId', '==', profileId)
        .get();

      const profile = result.docs.map((item) => ({
        ...item.data(),
        docId: item.id,
      }));

      setProfileDetails(profile[0]);
      setFullName(profile[0].fullName);
      setUsername(profile[0].username);
    };
    fetchProfile();
  }, [profileId]);

  const hasUnmountedRef = useHasUnmountedRef();

  const handleChanges = async (e) => {
    e.preventDefault();
    if (hasUnmountedRef.current) {
      // escape early because component has unmounted
      return;
    }

    const { docId } = profileDetails;

    setLoading(true);
    const promises = [];
    setError('');
    try {
      if (image) {
        const file = await uploadImage(image, 'insta-profile');
        promises.push(updateProfileImage(file.secure_url, docId));
      }

      if (username !== profileDetails.username) {
        promises.push(updateProfileUsername(username, docId));
      }

      if (fullName !== profileDetails.fullName) {
        promises.push(updateProfileFullName(fullName, docId));
      }

      Promise.all(promises);

      setTimeout(() => {
        setProfileSaved('saved');
      }, 500);

      setTimeout(() => {
        setLoading(false);
        history.push(`/p/${profileId}`);
        setProfileSaved('');
      }, 2000);
    } catch (err) {
      setLoading(false);
      setError('Failed to update profile');
    }
  };

  const textButton = () => {
    if (profileSaved) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-green-primary mx-auto"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    }

    const color =
      window.document.getElementsByTagName('html')[0].className === 'light'
        ? '#000000'
        : '#fafafa';
    if (loading) {
      return <ReactLoader height={16} width={16} color={color} />;
    }
    return 'Save Changes';
  };

  const previewImage = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };

  const handlePhoto = (e) => {
    setError('');
    const file = e.target.files;

    const types = ['image/png', 'image/jpeg'];
    if (!types.includes(file[0]?.type)) {
      return setError('jpeg or png only');
    }

    previewImage(file[0]);
  };

  const imagePreview = image || profileDetails.avatar;

  return (
    <div className="flex flex-col items-center">
      {!profileDetails ? (
        <Skeleton count={1} width={300} height={200} className="mb-5 ml-10" />
      ) : (
        <div className="md:w-2/3 w-11/12">
          <img
            src={imagePreview}
            alt={profileDetails.username}
            className="md:w-48 w-40 md:h-48 h-40 rounded-full border border-red-primary mx-auto"
          />
          <label className="flex items-center justify-center text-blue-light dark:text-white hover:text-blue-medium dark:hover:text-blue-medium transition-colors duration-200 cursor-pointer">
            <input
              className="opacity-0 h-0 w-0"
              type="file"
              name="file"
              onChange={handlePhoto}
            />
            <span className="md:text-base text-sm font-bold mt-2">
              Change Photo
            </span>
          </label>
          <div className="mt-2 md:w-2/3 w-11/12 mx-auto">
            <div className="mt-4">
              <label className="text-gray-medium">Name</label>
              <input
                aria-label="Add a Full Name"
                autoComplete="off"
                className="md:text-sm text-xs w-full md:mr-3 mr-1 md:pt-3 pt-2 border-b bg-gray-background border-gray-primary dark:bg-black-light dark:text-white"
                type="text"
                name="add-fullName"
                placeholder="Add full name..."
                value={fullName}
                onChange={({ target }) => setFullName(target.value)}
              />
            </div>
            <div className="mt-4">
              <label className="text-gray-medium">Username</label>
              <input
                aria-label="Add a Full Name"
                autoComplete="off"
                className="md:text-sm text-xs w-full md:mr-3 mr-1 md:pt-3 pt-2 border-b bg-gray-background border-gray-primary dark:bg-black-light dark:text-white"
                type="text"
                name="add-fullName"
                placeholder="Add full name..."
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            {error && <p className="text-red-primary mt-2">{error}</p>}
          </div>
          <div className="flex items-center justify-center mt-10">
            <button
              type="button"
              className={`bg-gray-background hover:bg-blue-light text-blue-medium ${
                profileSaved && 'text-green-primary'
              } hover:text-white transition-colors duration-200 border rounded px-3 py-1 focus:outline-none w-28 h-8 md:text-sm text-xs mx-auto dark:bg-black-light dark:hover:bg-black-faded dark:text-white`}
              onClick={handleChanges}
            >
              {textButton()}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
