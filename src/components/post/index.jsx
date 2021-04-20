import { useRef } from 'react';

import Header from './header';
import Actions from './actions';
import Footer from './footer';
import Comments from './comments';
import Image from './image';

const Post = ({ content }) => {
  const commentInput = useRef(null);
  const handleFocus = () => commentInput.current.focus();

  // components
  // -> header, image, actions (like & comment icons), footer, comments
  return (
    <div className="rounded border bg-white border-gray-primary md:mb-12 mb-6 md:mx-1 mx-6">
      <Header
        username={content.username}
        avatar={content.avatar}
        docId={content.docId}
        postUserId={content.userId}
      />
      <Image src={content.imageSrc} caption={content.caption} />
      <Actions
        docId={content.docId}
        totalLikes={content.likes.length}
        likedPhoto={content.userLikedPhoto}
        handleFocus={handleFocus}
        postUserId={content.userId}
      />
      <Footer caption={content.caption} />
      <Comments
        docId={content.docId}
        comments={content.comments}
        posted={content.dateCreated}
        commentInput={commentInput}
        content={content}
        postUserId={content.userId}
      />
    </div>
  );
};

export default Post;
