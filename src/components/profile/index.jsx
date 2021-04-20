import { useReducer, useEffect } from 'react';
import Header from './header';
import Photos from './photos';
import { getUserPhotosByUserId } from '../../services/firebase';

const Profile = ({ user }) => {
  const reducer = (state, newState) => ({ ...state, ...newState });
  const initialState = {
    profile: {},
    photosCollection: [],
    followerCount: 0,
  };

  const [{ profile, photosCollection, followerCount }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function getProfileInfoAndPhotos() {
      const photos = await getUserPhotosByUserId(user.userId);

      dispatch({
        profile: user,
        photosCollection: photos,
        followerCount: user.followers.length,
      });
    }
    getProfileInfoAndPhotos();
  }, [user.userId]);

  return (
    <>
      <Header
        photosCount={photosCollection ? photosCollection.length : 0}
        profile={profile}
        followerCount={followerCount}
        setFollowerCount={dispatch}
      />
      <div className="h-16 border-t border-gray-primary mt-12 pt-4">
        <div className="grid grid-cols-3 md:gap-6 gap-4 mx-2  mt-4 mb-12">
          {photosCollection.map((photo) => (
            <Photos key={photo.docId} photo={photo} />
          ))}
        </div>
        {!photosCollection ||
          (photosCollection.length === 0 && (
            <p className="text-center text-2xl">No Posts Yet</p>
          ))}
      </div>
    </>
  );
};

export default Profile;
