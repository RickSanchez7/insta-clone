/* eslint-disable jsx-a11y/img-redundant-alt */
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { DEFAULT_IMAGE_PATH } from '../../constants/paths';

const Header = ({ username, avatar }) => {
  const image = avatar !== undefined ? avatar : DEFAULT_IMAGE_PATH;

  return (
    <div className="flex border-b border-gray-primary h-4 p-4 md:py-8 py-5">
      <div className="flex items-center">
        <Link to={`/p/${username}`} className="flex items-center">
          <img
            className="rounded-full h-8 w-8 flex mr-3"
            src={image}
            alt={`${username} profile picture`}
          />
          <p className="font-bold md:text-base text-sm">{username}</p>
        </Link>
      </div>
    </div>
  );
};

Header.propTypes = {
  username: PropTypes.string.isRequired,
};

export default Header;
