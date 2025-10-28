import { useState } from 'react';
import PreProcess from './PreProcess';
import RagModel from './RagModel';
import LlmModels from './LlmModels';

const UploadFiles = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [uploaded, setUploaded] = useState(false);
  const [mode, setMode] = useState(''); // 'rag' or 'preprocess'
  const [llm, setLlm] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setUploaded(false);
    setMode('');
  };

  const handleclick = () => {
    setMode('llm');
    setLlm(true);
    setUploaded(true);

  }

  const handleUpload = async () => {
    if (!file) return alert('Please select a file first.');

    const allowedExtensions = ['csv', 'xls', 'xlsx'];
    const fileExt = file.name.split('.').pop().toLowerCase();

    // Handle RAG (non-tabular) files
    if (!allowedExtensions.includes(fileExt)) {
      setMode('rag');
      setUploaded(true);
      setMessage('⚙️ Non-tabular file detected. Using RAG model.');
      return;
    }

    // Otherwise handle normal upload
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.status === 200) {
        setMessage('✅ Uploaded successfully!');
        setUploaded(true);
        setMode('preprocess');
      } else {
        setMessage('❌ Upload failed, try again.');
        setUploaded(false);
        setMode('');
      }

      await res.json();
    } catch (err) {
      console.error(err);
      setMessage('⚠️ Error during upload.');
      setUploaded(false);
      setMode('');
    }
  };

  return (
    <section className="py-5">
      <div className="bg-linear-to-tr from-white to-amber-50 rounded-2xl p-1 shadow-lg">
        <div>
          {!uploaded && (
            <>
              <div className="flex justify-around items-center">
                 <button
                  onClick={handleclick}
                  className="flex justify-center bg-pink-600 hover:bg-pink-700 text-white px-5 py-3 rounded-full shadow"
                >
                  switch to LLM model
                </button>
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
            </>
          )}

          {uploaded && mode === 'preprocess' && (
            <div className="mt-5">
              <PreProcess />
            </div>
          )}

          {uploaded && mode === 'rag' && (
            <div className="mt-5">
              <RagModel />
            </div>
          )}

          {uploaded && mode === 'llm' && (
            <div className="mt-5">
              <LlmModels />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UploadFiles;
