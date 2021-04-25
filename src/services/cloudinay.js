export const uploadImage = async (image, preset) => {
  const data = new FormData();
  data.append('file', image);
  data.append('upload_preset', preset);
  const res = await fetch(process.env.REACT_APP_CLOUDINARY_URL, {
    method: 'POST',
    body: data,
  });
  const file = await res.json();
  return file;
};
