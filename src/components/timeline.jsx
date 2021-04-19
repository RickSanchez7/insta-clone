/* eslint-disable no-nested-ternary */
import { useContext, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { motion } from 'framer-motion';

import LoggedInUserContext from '../context/logged-in-user';
// import usePhotos from '../hooks/use-photos';
import Post from './post';
import PostUpload from './post/post-upload';

import { firebase } from '../lib/firebase';
import { getUserByUserId } from '../services/firebase';

const Timeline = () => {
  const { user } = useContext(LoggedInUserContext);

  const [userPhotos, setUserPhotos] = useState([]);
  const [detailedPhotos, setDetailedPhotos] = useState([]);
  const [pages, setPages] = useState(10);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const photo = firebase
      .firestore()
      .collection('photos')
      .orderBy('dateCreated', 'desc')
      .limit(pages)
      .onSnapshot((snapshot) => {
        setUserPhotos(
          snapshot.docs.map((doc) => ({
            docId: doc.id,
            ...doc.data(),
          }))
        );
      });

    return () => photo();
  }, [user?.docId, pages]);

  useEffect(() => {
    setLoading(true);
    const func = async () => {
      const photosWithUserDetails = await Promise.all(
        userPhotos.map(async (photo) => {
          let userLikedPhoto = false;
          if (photo.likes.includes(user?.userId)) {
            userLikedPhoto = true;
          }
          // photo.userId = 2
          const loggedUser = await getUserByUserId(photo.userId);
          // raphael
          const { username, avatar } = loggedUser[0];
          return { username, ...photo, userLikedPhoto, avatar };
        })
      );
      setDetailedPhotos(photosWithUserDetails);
      setLoading(false);
    };

    func();
  }, [userPhotos]);

  const morePages = () => {
    setPages((prev) => prev + 5);
  };

  return (
    <div className="container flex flex-col md:col-span-2 col-span-3">
      <PostUpload />
      {!detailedPhotos ? (
        <Skeleton count={4} width={640} height={500} className="mb-5" />
      ) : (
        detailedPhotos.map((content) => (
          <motion.div key={content.docId} layout>
            <Post content={content} />
          </motion.div>
        ))
      )}
      <button
        type="button"
        className="bg-blue-medium hover:bg-blue-light transition-colors duaration-200 text-white font-bold py-2 px-4 rounded-full mb-12 self-center"
        onClick={morePages}
      >
        {loading ? 'Loading' : 'More'}
      </button>
    </div>
  );
};

export default Timeline;
