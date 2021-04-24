import { useContext, useEffect, useState } from 'react';
import { formatDistance } from 'date-fns';
import { Link } from 'react-router-dom';
import { FieldValue, firebase } from '../../lib/firebase';

import AddComment from './add-comment';
import { UserContext } from '../../context/user';

const Comments = ({ docId, posted, commentInput, postUserId }) => {
  const {
    user: { username, role },
  } = useContext(UserContext);

  const [commentsSlice, setCommentsSlice] = useState(2);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');

  const showNextComments = () => {
    setCommentsSlice(commentsSlice + 3);
  };

  // fetch comments
  useEffect(() => {
    let unsubscribe;
    if (docId) {
      unsubscribe = firebase
        .firestore()
        .collection('photos')
        .doc(docId)
        .collection('comments')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          setComments(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              comments: doc.data(),
            }))
          );
        });
    }
    return () => {
      unsubscribe();
    };
  }, [docId]);

  const deleteComment = async (id) => {
    setError('');
    try {
      await firebase
        .firestore()
        .collection('photos')
        .doc(docId)
        .update({
          totalComments: FieldValue.increment(-1),
        });

      await firebase
        .firestore()
        .collection('photos')
        .doc(docId)
        .collection('comments')
        .doc(id)
        .delete();
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <>
      <div className="md:px-4 px-2 md:py-4 py-2">
        {comments?.slice(0, commentsSlice).map((item) => (
          <div key={item.id} className="mb-1 flex items-center">
            <div className="flex flex-col md:flex-row md:items-center justify-center md:text-base text-xs">
              <Link to={`/p/${item.comments.displayName}`}>
                <span className="mr-1 font-bold">
                  {item.comments.displayName}
                </span>
              </Link>
              <span>{item.comments.text}</span>
            </div>
            {(item.comments.displayName === username || role === 'admin') && (
              <svg
                className="h-5 w-5 ml-auto cursor-pointer hover:text-red-primary fill-current hover:text-red-primary transition-colors duration-200 ease-in-out"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={() => deleteComment(item.id)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            )}
          </div>
        ))}
        {comments.length >= 3 && commentsSlice < comments.length && (
          <button
            className="text-sm text-gray-base mb-1 cursor-pointer focus:outline-none"
            type="button"
            onClick={showNextComments}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                showNextComments();
              }
            }}
          >
            View more comments
          </button>
        )}
        {error && <p className="text-red-primary">error</p>}
        <p className="text-gray-base uppercase text-xs md:mt-2 mt-1">
          {formatDistance(posted, new Date())} ago
        </p>
      </div>
      <AddComment
        docId={docId}
        commentInput={commentInput}
        postUserId={postUserId}
        username={username}
      />
    </>
  );
};

export default Comments;
