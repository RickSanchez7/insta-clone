import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import LazyLoad from 'react-lazyload';

export default function Image({ src, caption }) {
  return (
    <LazyLoad height={800} offset={200} scroll>
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
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
