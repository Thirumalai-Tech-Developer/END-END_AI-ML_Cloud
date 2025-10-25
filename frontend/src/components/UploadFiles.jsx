import { useState } from 'react';

const UploadFiles = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleUpload = () => {
    if (!file) return alert('Please select a file first.');

    const formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData,
    })
      .then((res) => {
        if (res.status === 200) {
          setMessage('✅ Uploaded successfully!');
        } else {
          setMessage('❌ Upload failed, try again.');
        }
        return res.json();
      })
      .then((data) => console.log(data))
      .catch((err) => {
        console.error(err);
        setMessage('⚠️ Error during upload.');
      });
  };

  return (
    <section className="py-5">
        <div className="bg-linear-to-tr from-white to-amber-50 rounded-2xl p-1 shadow-lg">
        <div>
            <div className="flex justify-center items-center">
            <input
                type="file"
                onChange={handleFileChange}
                className="flex text-center bg-green-600 hover:bg-green-700 text-white px-3 py-3 rounded-3xl"
            />
            </div>
            <br />
            <h1 className="flex justify-center">
            {file ? `Selected file: ${file.name}` : 'No file selected'}
            </h1>
            <br />
            <h3 className="flex justify-center">
            Upload Dataset under 100MB for quick experimentation.
            </h3>
            <br />
            <div className="flex justify-center">
            <button
                onClick={handleUpload}
                className="flex justify-center bg-amber-600 hover:bg-amber-700 text-white px-5 py-3 rounded-md shadow"
            >
                Upload
            </button>
            </div>
            <br />
            {message && (
            <p className="flex justify-center text-green-600 font-semibold">
                {message}
            </p>
            )}
        </div>
        </div>
    </section>
  );
};

export default UploadFiles;
