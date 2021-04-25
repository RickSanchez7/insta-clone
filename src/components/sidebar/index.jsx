import { useContext } from 'react';
import User from './user';
import Suggestions from './suggestions';
import { UserContext } from '../../context/user';

const Sidebar = () => {
  const {
    user: { docId = '', fullName, username, userId, following, avatar } = {},
  } = useContext(UserContext);

  return (
    <div className="md:p-4 p-0">
      <User
        username={username}
        fullName={fullName}
        avatar={avatar}
        userId={userId}
      />
      <Suggestions
        userId={userId}
        following={following}
        loggedInUserDocId={docId}
      />
    </div>
  );
};

export default Sidebar;
