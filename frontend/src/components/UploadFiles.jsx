import { useState } from 'react';

const UploadFiles = () => {

    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    }

    const handleUpload = () => {
    if (!file) return alert('Please select a file first.');
    const formData = new FormData();
    formData.append("file", file);

    fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.error(err));
  }
    return (
        <div className="bg-linear-to-tr from-white to-amber-50 rounded-2xl p-1 shadow-lg">
            <div className=''>
                <div className='flex justify-center items-center'>
                    <input type="file" onChange={handleFileChange} className='flex text-center bg-green-600 hover:bg-green-700 text-white px-3 py-3 rounded-3xl'/>
                </div>
                <br/>
                <h1 className='flex justify-center'>
                {file ? `Selected file: ${file.name}` : 'No file selected'}
                </h1>
                <br/>
                <h3 className='flex justify-center'>
                Upload Dataset under 100MB for quick experimentation.
                </h3>
                <br/>
                <div className='flex justify-center'>
                    <button onClick={handleUpload} className='flex justify-center bg-amber-600 hover:bg-amber-700 text-white px-5 py-3 rounded-md shadow'>Upload</button>
                </div>
            </div>
        </div>
    )
}

export default UploadFiles;
