import React, { useContext, useState } from 'react';
import { postUpload } from '../../services/firebase';
import LoggedInUserContext from '../../context/logged-in-user';
import ReactLoader from '../loader';

const PostUpload = () => {
  const [caption, setCaption] = useState('');
  const [previewSource, setPreviewSource] = useState('');
  const [selectedFile, setSelectedFile] = useState();
  // const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState('');

  const { user } = useContext(LoggedInUserContext);

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    const data = new FormData();
    data.append('file', selectedFile[0]);
    data.append('upload_preset', 'ricardo');
    setLoading(true);
    const res = await fetch(
      'https://api.cloudinary.com/v1_1/drqvkgn34/image/upload',
      {
        method: 'POST',
        body: data,
      }
    );
    const file = await res.json();

    postUpload(file.secure_url, caption, user?.userId);
    setCaption('');
    setPreviewSource('');
    setSelectedFile('');
    setLoading(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files;

    const types = ['image/png', 'image/jpeg'];
    if (!types.includes(file[0].type)) {
      return;
    }
    previewFile(file[0]);
    setSelectedFile(file);
  };

  return (
    <div className="rounded col-span-4 border bg-white border-gray-primary md:mb-12 mb-6 md:ml-0 ml-3">
      {/* <div className="md:h-52 h-40 my-2"> */}
      {previewSource && (
        <img
          src={previewSource}
          alt="preview"
          className="md:h-52 h-40 mx-auto mt-2"
        />
      )}
      {/* </div> */}
      <label className="flex items-center justify-center md:w-10 md:h-10 h-7 w-7 border border-red-primary text-red-primary rounded-full md:text-3xl text-xl hover:text-white hover:bg-red-primary cursor-pointer mx-auto mt-2">
        <input
          className="opacity-0 h-0 w-0"
          type="file"
          name="file"
          onChange={handleFileInputChange}
        />
        <span className="md:mb-2 mb-1">+</span>
      </label>
      <div className="flex border-t border-gray-primary mt-2">
        <input
          type="text"
          aria-label="Add a text"
          autoComplete="off"
          className="md:text-sm text-xs text-gray-base w-full mr-3 md:py-5 py-2 md:px-4 px-2 outline-none"
          name="add-text"
          placeholder="Add a text..."
          value={caption}
          onChange={({ target }) => setCaption(target.value)}
        />
        <button
          className={`md:text-sm text-xs font-bold text-blue-medium mr-2 focus:outline-none ${
            !caption && 'opacity-25'
          }`}
          type="button"
          disabled={caption.length < 1 && !previewFile}
          onClick={handleUpload}
        >
          {loading ? <ReactLoader height={15} width={15} /> : 'Submit'}
        </button>
      </div>
    </div>
  );
};

export default PostUpload;
