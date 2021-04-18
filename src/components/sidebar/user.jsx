import { memo } from 'react';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';

// import { DEFAULT_IMAGE_PATH } from '../../constants/paths';

const User = ({ username, fullName, avatar }) => {
  return !username || !fullName ? (
    <Skeleton count={1} height={61} />
  ) : (
    <Link
      to={`/p/${username}`}
      className="flex md:mb-6 mb-4 items-center justify-evenly"
    >
      <div className="flex items-center justify-evenly">
        <img
          className="rounded-full md:w-16 md:h-16 w-9 h-9 flex md:mr-3 mr-1"
          src={`${avatar}`}
          alt={`${username}`}
        />
      </div>
      <div>
        <p className="font-bold md:text-sm text-xs">{username}</p>
        <p className="md:text-sm text-xs">{fullName}</p>
      </div>
    </Link>
  );
};

export default memo(User);
