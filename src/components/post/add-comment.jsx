import { useState, useContext } from 'react';
import { FirebaseContext } from '../../context/firebase';
import LoggedInUserContext from '../../context/logged-in-user';

const AddComment = ({ docId, commentInput }) => {
  const [comment, setComment] = useState('');
  const { firebase, FieldValue } = useContext(FirebaseContext);
  const {
    user: { username },
  } = useContext(LoggedInUserContext);

  const handleSubmitComment = (event) => {
    event.preventDefault();

    setComment('');

    return firebase
      .firestore()
      .collection('photos')
      .doc(docId)
      .collection('comments')
      .add({
        text: comment,
        displayName: username,
        timestamp: FieldValue.serverTimestamp(),
      });
  };

  return (
    <div className="border-t border-gray-primary">
      <form
        className="flex justify-between pl-0 pr-5"
        method="POST"
        onSubmit={(event) =>
          comment.length >= 1
            ? handleSubmitComment(event)
            : event.preventDefault()
        }
      >
        <input
          aria-label="Add a comment"
          autoComplete="off"
          className="md:text-sm text-xs text-gray-base w-full mr-3 md:py-5 py-3 px-4"
          type="text"
          name="add-comment"
          placeholder="Add a comment..."
          value={comment}
          onChange={({ target }) => setComment(target.value)}
          ref={commentInput}
        />
        <button
          className={`md:text-sm text-xs font-bold text-blue-medium ${
            !comment && 'opacity-25'
          }`}
          type="button"
          disabled={comment.length < 1}
          onClick={handleSubmitComment}
        >
          Post
        </button>
      </form>
    </div>
  );
};

export default AddComment;
