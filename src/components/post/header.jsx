/* eslint-disable jsx-a11y/img-redundant-alt */
import PropTypes from 'prop-types';
import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { DEFAULT_IMAGE_PATH } from '../../constants/paths';
import { FirebaseContext } from '../../context/firebase';
import { UserContext } from '../../context/user';

const variants = {
  open: { opacity: 1, height: 'auto' },
  closed: { opacity: 0, height: 0 },
};

const Header = ({ username, avatar, docId, postUserId }) => {
  const image = avatar !== undefined ? avatar : DEFAULT_IMAGE_PATH;

  const [button, setButton] = useState('hidden');

  const { firebase } = useContext(FirebaseContext);
  const {
    user: { userId, role },
  } = useContext(UserContext);

  const showButton = () => {
    if (button === 'hidden') return setButton('');
    return setButton('hidden');
  };

  const deletePost = async () => {
    await firebase.firestore().collection('photos').doc(docId).delete();
    setButton('hidden');
  };

  // Close dropdown when clicking outside
  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (ref.current && !ref.current.contains(e.target)) {
          setButton('hidden');
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
        <Link to={`/p/${postUserId}`} className="flex items-center">
          <img
            className="rounded-full border border-red-primary md:h-11 h-8 md:w-11 w-8 flex mr-3"
            src={image}
            alt={`${username} profile picture`}
          />
          <p className="font-bold md:text-base dark:text-white dark:hover:text-black-light text-sm transition-colors duration-200">
            {username}
          </p>
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
              className="h-6 w-6 dark:text-white hover:text-red-primary dark:hover:text-black-light transition-colors duration-200 ease-in-out"
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
          <motion.div
            animate={button !== 'hidden' ? 'open' : 'closed'}
            variants={variants}
            transition={{ duration: 0.15 }}
            className={`${button} absolute flex flex-col md:mt-20 mt-16 bg-white dark:bg-black-light border border-gray-primary dark:border-white shadow-md z-10 right-4 rounded py-1`}
          >
            <Link to={`/edit-post/${docId}`} className="md:text-base text-sm">
              <button
                type="button"
                className="font-bold italic transition-colors duration-200 linear py-1 md:px-5 px-3 dark:text-white hover:text-red-primary dark:hover:text-red-primary md:w-24 w-20"
              >
                edit
              </button>
            </Link>
            <button
              type="button"
              onClick={deletePost}
              className="font-bold italic transition-colors duration-200 linear py-1 md:px-5 px-3 dark:text-white hover:text-red-primary dark:hover:text-red-primary md:w-24 w-20"
            >
              <p className="md:text-base text-sm">delete</p>
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

Header.propTypes = {
  username: PropTypes.string.isRequired,
};

export default Header;
