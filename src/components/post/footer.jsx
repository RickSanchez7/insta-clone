import PropTypes from 'prop-types';

const Footer = ({ caption }) => {
  return (
    <div className="md:px-4 px-2 py-2 dark:text-white">
      <span className="italic md:text-base text-sm">{caption}</span>
    </div>
  );
};

Footer.propTypes = {
  caption: PropTypes.string.isRequired,
};

export default Footer;
