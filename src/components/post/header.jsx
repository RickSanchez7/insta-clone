/* eslint-disable jsx-a11y/img-redundant-alt */
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { DEFAULT_IMAGE_PATH } from '../../constants/paths';

const Header = ({ username, avatar }) => {
  const image = avatar !== undefined ? avatar : DEFAULT_IMAGE_PATH;

  return (
    <div className="flex border-b border-gray-primary h-4 md:px-4 px-2 md:py-8 py-5">
      <div className="flex items-center">
        <Link to={`/p/${username}`} className="flex items-center">
          <img
            className="rounded-full border border-red-primary md:h-11 h-8 md:w-11 w-8 flex mr-3"
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
