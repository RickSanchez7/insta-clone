import PropTypes from 'prop-types';
import LazyLoad from 'react-lazyload';

export default function Image({ src, caption }) {
  return (
    <LazyLoad height={200} offset={200} scroll>
      <img
        className="md:opacity-90 opacity-100 hover:opacity-100 transition-opacity"
        src={src}
        alt={caption}
      />
    </LazyLoad>
  );
}

Image.propTypes = {
  src: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
};
