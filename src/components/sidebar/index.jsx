import { memo } from 'react';
import User from './user';
import Suggestions from './suggestions';

const Sidebar = ({ activeUser }) => {
  const { docId, fullName, username, userId, following, avatar } = activeUser;

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

export default memo(Sidebar);
