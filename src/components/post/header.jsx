/* eslint-disable jsx-a11y/img-redundant-alt */
import PropTypes from 'prop-types';
import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_IMAGE_PATH } from '../../constants/paths';
import { FirebaseContext } from '../../context/firebase';
import LoggedInUserContext from '../../context/logged-in-user';
import UserContext from '../../context/user';

const Header = ({ username, avatar, docId, postUserId }) => {
  const image = avatar !== undefined ? avatar : DEFAULT_IMAGE_PATH;

  const [button, setButton] = useState('hidden opacity-0');

  const { firebase } = useContext(FirebaseContext);
  const {
    user: { uid: userId },
  } = useContext(UserContext);
  const {
    user: { role },
  } = useContext(LoggedInUserContext);

  const showButton = () => {
    if (button === 'hidden opacity-0') return setButton('flex opacity-100');
    return setButton('hidden opacity-0');
  };

  const deletePost = async () => {
    await firebase.firestore().collection('photos').doc(docId).delete();
    setButton('hidden opacity-0');
  };

  // Close dropdown when clicking outside
  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
          setButton('hidden opacity-0');
        }
      };

      // Bind the event listener
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  };

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  return (
    <div className="flex border-b border-gray-primary h-4 md:px-4 px-2 md:py-8 py-5 justify-between items-center">
      <div className="flex items-center">
        <Link to={`/p/${username}`} className="flex items-center">
          <img
            className="rounded-full border border-red-primary md:h-11 h-8 md:w-11 w-8 flex mr-3"
            src={image}
            alt={`${username} profile picture`}
          />
          <p className="font-bold md:text-base text-sm">{username}</p>
        </Link>
      </div>
      {(postUserId === userId || role === 'admin') && (
        <div ref={wrapperRef} className="flex items-center relative">
          <button
            type="button"
            onClick={showButton}
            className="md:m-h-12 m-h-8 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 hover:text-red-primary transition-colors duration-200 ease-in-out"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={deletePost}
            className={`${button} absolute font-bold italic bg-white border border-gray-primary transition-all duration-200 rounded py-1 md:px-5 px-3 md:mt-10 mt-6 right-4 z-10`}
          >
            <p className="hover:text-red-primary transition-colors duration-200 ease-in-out md:text-base text-sm">
              delete
            </p>
          </button>
        </div>
      )}
    </div>
  );
};

Header.propTypes = {
  username: PropTypes.string.isRequired,
};

export default Header;
