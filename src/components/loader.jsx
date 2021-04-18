import Loader from 'react-loader-spinner';

const ReactLoader = ({ height = 70, width = 70 }) => {
  return (
    <Loader
      type="TailSpin"
      color="#000000"
      height={height}
      width={width}
      className="flex justify-center"
    />
  );
};

export default ReactLoader;
