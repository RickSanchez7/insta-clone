import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ReactLoader from '../components/loader';
import { firebase } from '../lib/firebase';
import { uploadImage } from '../services/cloudinay';
import { updateImage, updatePostMessage } from '../services/firebase';

function useHasUnmountedRef() {
  const hasUnmountedRef = useRef(false);
  useEffect(() => {
    return () => {
      hasUnmountedRef.current = true;
    };
  }, []);
  return hasUnmountedRef;
}

const Editpost = () => {
  const { id: postId } = useParams();
  const history = useHistory();

  const [postDetails, setPostDetails] = useState('');
  const [image, setImage] = useState('');
  const [message, setMessage] = useState('');
  const [postSaved, setPostSaved] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // fetch post
  useEffect(() => {
    const fetchPost = async () => {
      const post = await firebase
        .firestore()
        .collection('photos')
        .doc(postId)
        .get();

      setPostDetails(post.data());
      setMessage(post.data().caption);
    };
    fetchPost();
  }, [postId]);

  const hasUnmountedRef = useHasUnmountedRef();

  const handleChanges = async (e) => {
    e.preventDefault();
    if (hasUnmountedRef.current) {
      // escape early because component has unmounted
      return;
    }

    setLoading(true);
    const promises = [];
    setError('');
    try {
      if (image) {
        const file = await uploadImage(image, 'ricardo');
        promises.push(updateImage(file.secure_url, postId));
      }

      if (message) {
        promises.push(updatePostMessage(message, postId));
      }

      Promise.all(promises);

      setTimeout(() => {
        setPostSaved('saved');
      }, 500);

      setTimeout(() => {
        setLoading(false);
        history.push('/');
        setPostSaved('');
      }, 2000);
    } catch (err) {
      setLoading(false);
      setError('Failed to update post');
    }
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

  const resetChanges = () => {
    setImage('');
    setMessage(postDetails.caption);
  };

  const validateChanges = image !== '' || message !== postDetails.caption;

  const imagePreview = image || postDetails.imageSrc;

  const textButton = () => {
    if (postSaved) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-green-primary"
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
    if (loading) {
      return <ReactLoader height={15} width={15} />;
    }
    return 'Save';
  };

  return (
    <div className="rounded border bg-white border-gray-primary md:mb-12 mb-6 mx-auto md:w-auto w-4/5 max-w-lg flex flex-col">
      <form>
        <div className="flex border-b border-gray-primary h-4 md:px-4 px-2 md:py-8 py-5 justify-between items-center">
          <button
            className={`text-blue-medium hover:text-red-primary transition-colors duration-200 font-bold md:text-sm text-xs ${
              !validateChanges && 'hidden'
            }`}
            type="button"
            onClick={resetChanges}
          >
            Reset Changes
          </button>
          <label className="flex items-center justify-center  md:text-3xl text-xl hover:text-red-primary transition-colors duration-200 cursor-pointer ml-auto">
            <input
              className="opacity-0 h-0 w-0"
              type="file"
              name="file"
              onChange={handlePhoto}
            />
            <span className="md:text-sm text-xs font-bold">New Photo</span>
          </label>
        </div>
      </form>
      <img src={imagePreview} alt={postDetails.userId} />
      <div className="border-t border-gray-primary">
        {error && <p className="text-red-primary md:px-4 px-2">{error}</p>}
        <form className="flex justify-between pl-0 md:pr-5 pr-3" method="POST">
          <input
            aria-label="Add a message"
            autoComplete="off"
            className="md:text-sm text-xs text-gray-base w-full md:mr-3 mr-1 md:py-5 py-3 md:px-4 px-2"
            type="text"
            name="add-message"
            placeholder="Add a message..."
            value={message}
            onChange={({ target }) => setMessage(target.value)}
          />

          <button
            className="md:text-sm text-xs font-bold text-blue-medium hover:text-blue-darker transition-colors duration-200 focus:outline-none"
            type="button"
            onClick={handleChanges}
          >
            {textButton()}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Editpost;
