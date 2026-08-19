import React, { useState } from 'react';
import { FaFileUpload } from 'react-icons/fa';

const DocumentUploadPage = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await fetch('http://localhost:5000/api/documents/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
      });
      alert('Document uploaded successfully!');
      setFile(null);
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-300 p-6 sm:p-8 min-h-[480px]">
      <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-300 flex items-center gap-2.5">
        <FaFileUpload className="text-[#0052cc]" /> Document Upload
      </h2>
      <div className="space-y-4 max-w-md">
        <input type="file" onChange={e => setFile(e.target.files[0])} className="block w-full border border-gray-200 rounded p-2" />
        <button onClick={handleUpload} disabled={!file || uploading} className="px-4 py-2 bg-[#0052cc] text-white rounded hover:bg-blue-700 disabled:opacity-50">
          {uploading ? 'Uploading...' : 'Upload Document'}
        </button>
      </div>
    </div>
  );
};

export default DocumentUploadPage;
