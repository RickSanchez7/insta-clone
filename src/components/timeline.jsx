/* eslint-disable no-nested-ternary */
import { useEffect, useState, memo, useContext } from 'react';
import Skeleton from 'react-loading-skeleton';
import { motion } from 'framer-motion';

import Post from './post';
import PostUpload from './post/post-upload';

import { firebase } from '../lib/firebase';
import { getUserByUserId } from '../services/firebase';
import { UserContext } from '../context/user';
import ReactLoader from './loader';

const Timeline = () => {
  const { user } = useContext(UserContext);

  const [userPhotos, setUserPhotos] = useState([]);
  const [detailedPhotos, setDetailedPhotos] = useState([]);
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const photo = firebase
      .firestore()
      .collection('photos')
      .orderBy('dateCreated', 'desc')
      .limit(10)
      .onSnapshot((snapshot) => {
        setUserPhotos(
          snapshot.docs.map((doc) => ({
            docId: doc.id,
            ...doc.data(),
          }))
        );
      });

    return () => photo();
  }, []);

  const fetchNextPhotos = () => {
    firebase
      .firestore()
      .collection('photos')
      .orderBy('dateCreated', 'desc')
      .limit(10)
      .startAfter(userPhotos[userPhotos.length - 1].dateCreated)
      .onSnapshot((snapshot) => {
        const items = [];
        snapshot.forEach((doc) => {
          items.push({ docId: doc.id, ...doc.data() });
        });
        setUserPhotos([...userPhotos, ...items]);
      });

    if (pages !== userPhotos.length) {
      return setPages((prev) => prev + 2);
    }
    setPages(false);
  };

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

  return (
    <div className="container flex flex-col md:col-span-2 col-span-3">
      <PostUpload />
      {!detailedPhotos.length ? (
        <Skeleton count={4} width={550} height={500} className="mb-5" />
      ) : (
        detailedPhotos.map((content) => (
          <motion.div key={content.docId} layout>
            <Post content={content} />
          </motion.div>
        ))
      )}
      {pages !== false && (
        <button
          type="button"
          className="bg-blue-medium hover:bg-blue-light transition-colors duaration-200 text-white font-bold py-2 px-4 rounded-full mb-12 self-center md:w-20 w-16 md:h-10 h-8"
          onClick={fetchNextPhotos}
        >
          {!loading ? (
            <ReactLoader height={15} width={15} color="white" />
          ) : (
            'More'
          )}
        </button>
      )}
    </div>
  );
};

export default memo(Timeline);
