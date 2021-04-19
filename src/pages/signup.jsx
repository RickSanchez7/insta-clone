import { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FirebaseContext } from '../context/firebase';
import * as ROUTES from '../constants/routes';
import { doesUsernameExist, doesEmailExist } from '../services/firebase';

const SignUp = () => {
  const history = useHistory();
  const { firebase } = useContext(FirebaseContext);

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  const [error, setError] = useState('');

  const isInvalid = password === '' || email === '' || passwordConfirm === '';

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setPassword('');
      setPasswordConfirm('');
      return setError('Password must be at least 6 characters');
    }

    if (password !== passwordConfirm) {
      setPassword('');
      setPasswordConfirm('');
      return setError('Passwords do not match');
    }

    const usernameExists = await doesUsernameExist(username);
    const emailExists = await doesEmailExist(email);

    // verify if email is already in database
    if (emailExists) {
      setEmail('');
      return setError('Email already exists');
    }

    // verify if username is already in database
    if (!usernameExists.length) {
      try {
        const createdUserResult = await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password);

        // authentication
        // -> email & password & username (displayName)
        await createdUserResult.user.updateProfile({
          displayName: username,
        });

        // firebase user collection (create a document)
        await firebase.firestore().collection('users').add({
          userId: createdUserResult.user.uid,
          username: username.toLowerCase(),
          fullName,
          email: email.toLowerCase().trim(),
          avatar: '/images/avatars/defaultAvatar.png',
          following: [],
          followers: [],
          role: 'user',
          dateCreated: Date.now(),
        });
        setFullName('');
        setEmail('');
        setPassword('');
        setPasswordConfirm('');

        history.push(ROUTES.DASHBOARD);
      } catch (err) {
        setFullName('');
        setEmail('');
        setPassword('');
        setPasswordConfirm('');
        setError(err.message);
      }
    } else {
      setUsername('');
      setError('That username is already taken, please try another.');
    }
  };

  useEffect(() => {
    document.title = 'Sign Up - Insta';
  }, []);

  return (
    <div className="container flex mx-auto max-w-screen-md items-center justify-center h-screen">
      <div className="md:flex hidden w-3/5">
        <img
          src="/images/iphone-with-profile.jpg"
          alt="iPhone with Instagram app"
        />
      </div>
      <div className="flex flex-col md:w-2/5 w-4/5">
        <div className="flex flex-col items-center bg-white p-4 border border-gray-primary mb-4 rounded">
          <h1 className="flex justify-center w-full">
            <img
              src="/images/logo.png"
              alt="Instagram"
              className="mt-2 w-6/12 mb-4"
            />
          </h1>

          {error && <p className="mb-4 text-xs text-red-primary">{error}</p>}

          <form onSubmit={handleSignUp} method="POST">
            <input
              aria-label="Enter your username"
              type="text"
              placeholder="Username"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setUsername(target.value)}
              value={username}
            />
            <input
              aria-label="Enter your full name"
              type="text"
              placeholder="Full name"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setFullName(target.value)}
              value={fullName}
            />
            <input
              aria-label="Enter your email address"
              type="text"
              placeholder="Email Address"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setEmail(target.value)}
              value={email}
            />
            <input
              aria-label="Enter your password"
              type="password"
              placeholder="Password"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setPassword(target.value)}
              value={password}
            />
            <input
              aria-label="Confirm your password"
              type="password"
              placeholder="Confirm Password"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setPasswordConfirm(target.value)}
              value={passwordConfirm}
            />
            <button
              disabled={isInvalid}
              type="submit"
              className={`bg-blue-medium text-white w-full rounded h-8 font-bold
            ${isInvalid && 'opacity-50'}`}
            >
              Sign Up
            </button>
          </form>
        </div>
        <div className="flex justify-center items-center flex-col w-full bg-white p-4 rounded border border-gray-primary">
          <p className="text-sm">
            Have an account?{` `}
            <Link to={ROUTES.LOGIN} className="font-bold text-blue-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
