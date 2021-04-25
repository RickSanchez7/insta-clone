import { useContext, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { firebase } from '../lib/firebase';
import { UserContext } from '../context/user';
import * as ROUTES from '../constants/routes';
import { useAuth } from '../context/logged-in-user';

const Header = () => {
  const { user: loggedInUser } = useAuth();
  const { user } = useContext(UserContext);

  const [avatar, setAvatar] = useState();
  const history = useHistory();

  if (!loggedInUser) return null;

  useEffect(() => {
    const fetchAvatar = async () => {
      if (user?.docId) {
        firebase
          .firestore()
          .collection('users')
          .doc(user?.docId)
          .onSnapshot((snapshot) => {
            setAvatar(snapshot.data().avatar);
          });
      }
    };
    if (user) {
      fetchAvatar();
    }

    return () => fetchAvatar();
  }, [user]);

  return (
    <header className="h-16 bg-white dark:bg-black-light border-b border-gray-primary dark:border-gray-base transition-colors duration-200 mb-8">
      <div className="container mx-auto max-w-screen-lg h-full">
        <div className="flex justify-between h-full">
          <div className="text-gray-700 text-center flex items-center align-items cursor-pointer">
            <h1 className="flex justify-center w-full">
              <Link to={ROUTES.DASHBOARD} aria-label="Instagram logo">
                <img
                  src="/images/logo.png"
                  alt="Instagram"
                  className="mt-2 w-6/12 ml-2"
                />
              </Link>
            </h1>
          </div>
          <div className="text-gray-700 flex items-center align-items">
            {loggedInUser ? (
              <>
                <Link to={ROUTES.DASHBOARD} aria-label="Dashboard">
                  <svg
                    className="md:w-8 w-6 mr-6 text-black-light dark:text-white cursor-pointer hover:text-red-primary fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </Link>

                <button
                  type="button"
                  title="Sign Out"
                  onClick={() => {
                    firebase.auth().signOut();
                    history.push(ROUTES.LOGIN);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      firebase.auth().signOut();
                      history.push(ROUTES.LOGIN);
                    }
                  }}
                >
                  <svg
                    className="md:w-8 w-6 mr-6 text-black-light dark:text-white cursor-pointer hover:text-red-primary fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
                {user && (
                  <div className="flex items-center cursor-pointer  mr-1">
                    <Link to={`/p/${user?.userId}`}>
                      <img
                        className="rounded-full mr-2 md:h-11 md:w-11 h-10 w-10 flex border border-red-primary"
                        src={avatar && avatar}
                        alt={`${user?.username} profile`}
                      />
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link to={ROUTES.LOGIN}>
                  <button
                    type="button"
                    className="bg-blue-medium font-bold text-sm rounded text-white w-20 h-8"
                  >
                    Log In
                  </button>
                </Link>
                <Link to={ROUTES.SIGN_UP}>
                  <button
                    type="button"
                    className="font-bold text-sm rounded text-blue-medium w-20 h-8"
                  >
                    Sign Up
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
