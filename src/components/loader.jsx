import Loader from 'react-loader-spinner';

const ReactLoader = ({ height = 70, width = 70, color = '#000000' }) => {
  return (
    <Loader
      type="TailSpin"
      color={color}
      height={height}
      width={width}
      className="flex justify-center"
    />
  );
};

export default ReactLoader;
