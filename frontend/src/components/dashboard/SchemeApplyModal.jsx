import React, { useState } from 'react';
import { FaTimes, FaFileUpload } from 'react-icons/fa';
import { uploadDocument } from '../../services/upload.service';
import { applyForScheme } from '../../services/application.service';

const SchemeApplyModal = ({ isOpen, onClose, scheme, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !scheme) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload supporting documents (e.g. Aadhar, Income Certificate)');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // 1. Upload the file
      const uploadRes = await uploadDocument(file);
      if (!uploadRes.success) {
        throw new Error('Document upload failed');
      }

      // 2. Submit application with document URLs
      const documents = [{
        name: uploadRes.originalName,
        url: uploadRes.fileUrl
      }];

      const applyRes = await applyForScheme(scheme._id || scheme.id, documents);
      
      if (applyRes.success) {
        onSuccess(applyRes.application);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-800 tracking-tight truncate pr-4">
            Apply: {scheme.title}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer border-none bg-transparent">
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm mb-4">
            Please attach necessary supporting documents to complete your application.
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Supporting Document *</label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <FaFileUpload className="mx-auto text-3xl text-slate-400 mb-2" />
              <p className="text-sm text-slate-600 font-medium">
                {file ? file.name : 'Click or drag file to upload'}
              </p>
              <p className="text-xs text-slate-400 mt-1">PDF, JPG up to 5MB</p>
            </div>
          </div>

          {error && <p className="text-rose-500 text-sm font-medium">{error}</p>}

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg text-slate-600 font-semibold hover:bg-slate-100 transition-colors cursor-pointer border-none bg-transparent"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-[#0052cc] hover:bg-[#0047b3] text-white font-semibold shadow-sm transition-colors disabled:opacity-70 flex items-center gap-2 cursor-pointer border-none"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchemeApplyModal;
