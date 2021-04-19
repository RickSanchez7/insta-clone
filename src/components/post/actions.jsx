import { useState, useContext } from 'react';
import { FirebaseContext } from '../../context/firebase';
import UserContext from '../../context/user';
import LoggedInUserContext from '../../context/logged-in-user';

const Actions = ({
  docId,
  totalLikes,
  likedPhoto,
  handleFocus,
  postUserId,
}) => {
  const {
    user: { uid: userId },
  } = useContext(UserContext);
  const {
    user: { role },
  } = useContext(LoggedInUserContext);
  const [toggleLiked, setToggleLiked] = useState(likedPhoto);
  const [likes, setLikes] = useState(totalLikes);
  const { firebase, FieldValue } = useContext(FirebaseContext);

  const handleToggleLiked = async () => {
    setToggleLiked((prevLiked) => !prevLiked);

    await firebase
      .firestore()
      .collection('photos')
      .doc(docId)
      .update({
        likes: toggleLiked
          ? FieldValue.arrayRemove(userId)
          : FieldValue.arrayUnion(userId),
      });

    setLikes((likesCount) => (toggleLiked ? likesCount - 1 : likesCount + 1));
  };

  const deletePost = async () => {
    await firebase.firestore().collection('photos').doc(docId).delete();
  };

  return (
    <>
      <div className="flex justify-between md:px-4 px-2 md:py-4 py-2 my-0 md:m-h-14 m-h-10">
        <div className="flex ">
          <svg
            onClick={handleToggleLiked}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleToggleLiked();
              }
            }}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            tabIndex={0}
            className={`md:w-8 w-6 md:h-8 h-6 mr-4 select-none cursor-pointer focus:outline-none ${
              toggleLiked
                ? 'fill-red hover:fill-lightRed text-red-primary hover:text-red-secundary transition-colors duration-200'
                : 'text-black-light hover:text-red-primary transition-colors duration-200'
            }`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <svg
            onClick={handleFocus}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleFocus();
              }
            }}
            className="md:w-8 w-6 md:h-8 h-6 text-black-light hover:text-red-primary transition-colors duration-200 select-none cursor-pointer focus:outline-none"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            tabIndex={0}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
            &gt;
          </svg>
        </div>
        {(postUserId === userId || role === 'admin') && (
          <button
            type="button"
            onClick={deletePost}
            className="font-bold hover:text-red-primary transition-colors duration-200 italic"
          >
            delete
          </button>
        )}
      </div>
      <div className="md:px-4 px-2">
        <p className="font-bold">
          {likes === 1 ? `${likes} like` : `${likes} likes`}
        </p>
      </div>
    </>
  );
};

export default Actions;
