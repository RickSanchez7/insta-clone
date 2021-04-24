import { firebase, FieldValue } from '../lib/firebase';

export const doesUsernameExist = async (username) => {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('username', '==', username)
    .get();

  return result.docs.map((user) => user.data().length > 0);
};

export const getUserByUsername = async (username) => {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('username', '==', username)
    .get();

  return result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));
};

export const getUserByUserId = async (userId) => {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('userId', '==', userId)
    .get();

  return result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));
};

export const getSuggestedProfiles = async (userId, following) => {
  let query = firebase.firestore().collection('users');

  if (following.length > 0) {
    query = query.where('userId', 'not-in', [...following, userId]);
  } else {
    query = query.where('userId', '!=', userId);
  }
  const result = await query.limit(10).get();

  const profiles = result.docs.map((user) => ({
    ...user.data(),
    docId: user.id,
  }));

  return profiles;
};

export const updateLoggedInUserFollowing = async (
  loggedInUserDocId, // currently logged in user document id (ricardo's profile)
  profileId, // the user that ricardo requests to follow
  isFollowingProfile // true/false (am i currently following this person?)
) => {
  return firebase
    .firestore()
    .collection('users')
    .doc(loggedInUserDocId)
    .update({
      following: isFollowingProfile
        ? FieldValue.arrayRemove(profileId)
        : FieldValue.arrayUnion(profileId),
    });
};

export const updateFollowedUserFollowers = async (
  profileDocId, // currently logged in user document id (ricardo's profile)
  loggedInUserDocId, // the user that ricardo requests to follow
  isFollowingProfile // true/false (am i currently following this person?)
) => {
  return firebase
    .firestore()
    .collection('users')
    .doc(profileDocId)
    .update({
      followers: isFollowingProfile
        ? FieldValue.arrayRemove(loggedInUserDocId)
        : FieldValue.arrayUnion(loggedInUserDocId),
    });
};

export const getPhotos = async (userId) => {
  // [5,4,2] => following
  const result = await firebase
    .firestore()
    .collection('photos')
    // .where('userId', 'in', following)
    .get();

  const userFollowedPhotos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));

  const photosWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async (photo) => {
      let userLikedPhoto = false;
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }
      // photo.userId = 2
      const user = await getUserByUserId(photo.userId);
      // raphael
      const { username } = user[0];
      return { username, ...photo, userLikedPhoto };
    })
  );

  return photosWithUserDetails;
};

export const getUserPhotosByUserId = async (userId) => {
  const result = await firebase
    .firestore()
    .collection('photos')
    .where('userId', '==', userId)
    .get();

  const photos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));
  return photos;
};

export const isUserFollowingProfile = async (
  loggedInUserUsername,
  profileUserId
) => {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('username', '==', loggedInUserUsername) // ricardo (active logged in user)
    .where('following', 'array-contains', profileUserId)
    .get();

  const [response = {}] = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  return response.userId;
};

export const toggleFollow = async (
  isFollowingProfile,
  activeUserDocId,
  profileDocId,
  profileUserId,
  followingUserId
) => {
  // 1st param: karl's doc id
  // 2nd param: raphael's user id
  // 3rd param: is the user following this profile? e.g. does karl follow raphael? (true/false)
  await updateLoggedInUserFollowing(
    activeUserDocId,
    profileUserId,
    isFollowingProfile
  );

  // 1st param: karl's user id
  // 2nd param: raphael's doc id
  // 3rd param: is the user following this profile? e.g. does karl follow raphael? (true/false)
  await updateFollowedUserFollowers(
    profileDocId,
    followingUserId,
    isFollowingProfile
  );
};

export const postUpload = async (imageUrl, caption, userId) => {
  const post = firebase.firestore().collection('photos').add({
    caption,
    dateCreated: Date.now(),
    totalComments: 0,
    imageSrc: imageUrl,
    likes: [],
    userId,
  });

  return post;
};
export const updateAvatar = async (imageUrl, userId) => {
  return firebase.firestore().collection('users').doc(userId).update({
    avatar: imageUrl,
  });
};

export const updateImage = async (imageUrl, docId) => {
  const image = firebase.firestore().collection('photos').doc(docId).update({
    imageSrc: imageUrl,
  });

  return image;
};

export const updatePostMessage = async (message, docId) => {
  const caption = firebase.firestore().collection('photos').doc(docId).update({
    caption: message,
  });

  return caption;
};
