import { useContext } from 'react';
import User from './user';
import Suggestions from './suggestions';
import LoggedInUserContext from '../../context/logged-in-user';

const Sidebar = () => {
  const {
    user: { docId = '', fullName, username, userId, following, avatar } = {},
  } = useContext(LoggedInUserContext);

  return (
    <div className="md:p-4 p-1">
      <User username={username} fullName={fullName} avatar={avatar} />
      <Suggestions
        userId={userId}
        following={following}
        loggedInUserDocId={docId}
      />
    </div>
  );
};

export default Sidebar;
