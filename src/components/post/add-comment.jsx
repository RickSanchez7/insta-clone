import { useState, useContext } from 'react';
import { FirebaseContext } from '../../context/firebase';

const AddComment = ({ docId, commentInput, postUserId, username }) => {
  const [comment, setComment] = useState('');
  const { firebase, FieldValue } = useContext(FirebaseContext);

  const handleSubmitComment = async (event) => {
    event.preventDefault();

    setComment('');

    await firebase
      .firestore()
      .collection('photos')
      .doc(docId)
      .update({
        totalComments: FieldValue.increment(1),
      });

    return await firebase
      .firestore()
      .collection('photos')
      .doc(docId)
      .collection('comments')
      .add({
        text: comment,
        displayName: username,
        timestamp: FieldValue.serverTimestamp(),
        postUserId,
      });
  };

  return (
    <div className="border-t border-gray-primary">
      <form
        className="flex justify-between pl-0 md:pr-5 pr-3"
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
          className="md:text-sm text-xs text-gray-base w-full mr-3 md:py-5 py-3 md:px-4 px-2"
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
