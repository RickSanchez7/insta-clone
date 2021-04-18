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
  // const { photos } = usePhotos(user);

  const [userPhotos, setUserPhotos] = useState([]);
  const [detailedPhotos, setDetailedPhotos] = useState([]);

  useEffect(() => {
    const photo = firebase
      .firestore()
      .collection('photos')
      .orderBy('dateCreated', 'desc')
      .onSnapshot((snapshot) => {
        setUserPhotos(
          snapshot.docs.map((doc) => ({
            docId: doc.id,
            ...doc.data(),
          }))
        );
      });

    return () => photo();
  }, [user?.docId]);

  useEffect(() => {
    const func = async () => {
      const photosWithUserDetails = await Promise.all(
        userPhotos.map(async (photo) => {
          let userLikedPhoto = false;
          if (photo.likes.includes(user)) {
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
    };

    func();
  }, [userPhotos]);

  return (
    <div className="container col-span-2">
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
    </div>
  );
};

export default Timeline;
