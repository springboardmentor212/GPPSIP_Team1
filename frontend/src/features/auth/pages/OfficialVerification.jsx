import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { FaInfoCircle } from 'react-icons/fa';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { FiUploadCloud } from 'react-icons/fi';
import { uploadDocument } from '../../../services/upload.service';
import { useToast } from '../../../hooks/useToast';

const OfficialVerification = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    employeeId: '',
    department: '',
    designation: '',
    officeEmail: '',
    officePhone: '',
    officeAddress: '',
    district: '',
    pinCode: '',
    idDocument: null
  });

  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const departmentsList = [
    'Select Department',
    'Ministry of Agriculture & Farmers Welfare',
    'Ministry of Education',
    'Ministry of Health and Family Welfare',
    'Ministry of Electronics and IT',
    'Ministry of Rural Development',
    'Ministry of Finance',
    'Ministry of Home Affairs',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (file) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, idDocument: 'File size must be max 5MB' }));
        return;
      }
      setFormData((prev) => ({ ...prev, idDocument: file }));
      setFileName(file.name);
      if (errors.idDocument) {
        setErrors((prev) => ({ ...prev, idDocument: '' }));
      }
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.employeeId.trim()) newErrors.employeeId = 'Government Employee ID is required';
    if (!formData.department || formData.department === 'Select Department') {
      newErrors.department = 'Please select a department';
    }
    if (!formData.designation.trim()) newErrors.designation = 'Designation is required';
    
    if (!formData.officeEmail.trim()) {
      newErrors.officeEmail = 'Office Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.officeEmail)) {
      newErrors.officeEmail = 'Invalid email address';
    }

    if (!formData.officeAddress.trim()) newErrors.officeAddress = 'Office Address is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';
    
    if (!formData.pinCode.trim()) {
      newErrors.pinCode = 'PIN Code is required';
    } else if (!/^\d{6}$/.test(formData.pinCode.trim())) {
      newErrors.pinCode = 'PIN Code must be 6 digits';
    }

    if (!formData.idDocument) {
      newErrors.idDocument = 'Please upload a Government ID document';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const uploadRes = await uploadDocument(formData.idDocument);
        if (uploadRes.success) {
          addToast('Official profile details and document submitted successfully!', 'success');
          navigate('/dashboard');
        }
      } catch (err) {
        addToast(err.response?.data?.message || err.message || 'File upload failed', 'error');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#eef4fb] text-slate-800 lg:h-screen lg:overflow-hidden font-sans">
      
      {/* LEFT PANEL - Hero Section */}
      <div className="relative w-full lg:w-[42%] xl:w-[40%] bg-[#0047b3] flex flex-col justify-between p-8 sm:p-12 lg:h-full overflow-hidden shrink-0">
        
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 opacity-90 transform scale-105"
          style={{ 
            backgroundImage: `url('/register_hero.jpg')` 
          }}
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-[#0052cc]/30 mix-blend-color pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 via-blue-900/30 to-transparent pointer-events-none z-10" />

        {/* Top Left PolicyGPT Logo */}
        <div className="relative z-20 flex items-center gap-2">
          <div className="flex items-end gap-0.5 h-6 shrink-0">
            <div className="w-[10px] h-[14px] bg-white rounded-tl-[2px] rounded-bl-[2px] opacity-90" />
            <div className="w-[10px] h-[22px] bg-white rounded-tr-[2px] rounded-br-[2px] opacity-100" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight ml-0.5">PolicyGPT</span>
        </div>

        {/* Center Bottom Hero Text */}
        <div className="relative z-20 mt-32 lg:mt-auto text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
            Empowering Every Citizen Through AI.
          </h1>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed font-light max-w-md">
            Simple. Secure. Accessible. Helping every citizen discover the right government schemes effortlessly.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL - Government Official Form */}
      <div className="w-full lg:w-[58%] xl:w-[60%] flex items-center justify-center p-4 sm:p-6 lg:p-8 lg:h-full lg:overflow-y-auto shrink-0">
        <div className="w-full max-w-[510px] bg-white rounded-[24px] border border-slate-200 shadow-md p-6 sm:p-7 transition-all">

          {/* Header */}
          <div className="text-center mb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0d1b3e] tracking-tight">
              Government Official Information
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Complete your official profile for verification.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* Government Employee ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Government Employee ID <span className="text-slate-900">*</span>
              </label>
              <input 
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                placeholder="e.g. EMP-12345"
                className={`w-full px-3.5 py-2.5 rounded-md border text-xs sm:text-sm bg-white text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${
                  errors.employeeId ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-300 focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]'
                }`}
              />
              {errors.employeeId && <p className="text-red-500 text-[11px] mt-1">{errors.employeeId}</p>}
            </div>

            {/* Department & Designation (2 Cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Department <span className="text-slate-900">*</span>
                </label>
                <div className="relative">
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className={`w-full px-3.5 py-2.5 rounded-md border text-xs sm:text-sm bg-white text-slate-800 appearance-none cursor-pointer focus:outline-none transition-all pr-8 ${
                      formData.department === '' || formData.department === 'Select Department' ? 'text-slate-400' : 'text-slate-800'
                    } ${
                      errors.department ? 'border-red-500' : 'border-slate-300 focus:border-[#2563eb]'
                    }`}
                  >
                    {departmentsList.map((dept, index) => (
                      <option key={index} value={dept} disabled={index === 0} className="text-slate-800">
                        {dept}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.department && <p className="text-red-500 text-[11px] mt-1">{errors.department}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Designation <span className="text-slate-900">*</span>
                </label>
                <input 
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  placeholder="e.g. Joint Secretary"
                  className={`w-full px-3.5 py-2.5 rounded-md border text-xs sm:text-sm bg-white text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${
                    errors.designation ? 'border-red-500' : 'border-slate-300 focus:border-[#2563eb]'
                  }`}
                />
                {errors.designation && <p className="text-red-500 text-[11px] mt-1">{errors.designation}</p>}
              </div>
            </div>

            {/* Office Email & Office Phone (2 Cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Office Email <span className="text-slate-900">*</span>
                </label>
                <input 
                  type="email"
                  name="officeEmail"
                  value={formData.officeEmail}
                  onChange={handleInputChange}
                  placeholder="name@gov.in"
                  className={`w-full px-3.5 py-2.5 rounded-md border text-xs sm:text-sm bg-white text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${
                    errors.officeEmail ? 'border-red-500' : 'border-slate-300 focus:border-[#2563eb]'
                  }`}
                />
                {errors.officeEmail && <p className="text-red-500 text-[11px] mt-1">{errors.officeEmail}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Office Phone
                </label>
                <input 
                  type="text"
                  name="officePhone"
                  value={formData.officePhone}
                  onChange={handleInputChange}
                  placeholder="+91 11 2345 6789"
                  className="w-full px-3.5 py-2.5 rounded-md border border-slate-300 text-xs sm:text-sm bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2563eb] transition-all"
                />
              </div>
            </div>

            {/* Office Address (Row Grid matching mockup style) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
              <label className="block text-xs font-semibold text-slate-800 sm:col-span-1">
                Office Address <span className="text-slate-900">*</span>
              </label>
              <div className="sm:col-span-2">
                <input 
                  type="text"
                  name="officeAddress"
                  value={formData.officeAddress}
                  onChange={handleInputChange}
                  placeholder="Building, Street, Area"
                  className={`w-full px-3.5 py-2.5 rounded-md border text-xs sm:text-sm bg-white text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${
                    errors.officeAddress ? 'border-red-500' : 'border-slate-300 focus:border-[#2563eb]'
                  }`}
                />
                {errors.officeAddress && <p className="text-red-500 text-[11px] mt-1">{errors.officeAddress}</p>}
              </div>
            </div>

            {/* District & PIN Code (2 Cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  District <span className="text-slate-900">*</span>
                </label>
                <input 
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  placeholder="Enter District"
                  className={`w-full px-3.5 py-2.5 rounded-md border text-xs sm:text-sm bg-white text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${
                    errors.district ? 'border-red-500' : 'border-slate-300 focus:border-[#2563eb]'
                  }`}
                />
                {errors.district && <p className="text-red-500 text-[11px] mt-1">{errors.district}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  PIN Code <span className="text-slate-900">*</span>
                </label>
                <input 
                  type="text"
                  name="pinCode"
                  value={formData.pinCode}
                  onChange={handleInputChange}
                  placeholder="110001"
                  className={`w-full px-3.5 py-2.5 rounded-md border text-xs sm:text-sm bg-white text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${
                    errors.pinCode ? 'border-red-500' : 'border-slate-300 focus:border-[#2563eb]'
                  }`}
                />
                {errors.pinCode && <p className="text-red-500 text-[11px] mt-1">{errors.pinCode}</p>}
              </div>
            </div>

            {/* Upload Government ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                Upload Government ID <span className="text-slate-900">*</span>
              </label>

              <div 
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer bg-white ${
                  dragActive ? 'border-[#2563eb] bg-blue-50/40' : errors.idDocument ? 'border-red-400 bg-red-50/20' : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <input 
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                <div className="flex flex-col items-center justify-center">
                  {/* Upload Icon Box */}
                  <div className="w-10 h-10 rounded-lg bg-[#e0edff] text-[#2563eb] flex items-center justify-center mb-2 shadow-xs">
                    {fileName ? (
                      <HiOutlineDocumentText className="w-5 h-5 text-[#2563eb]" />
                    ) : (
                      <FiUploadCloud className="w-5 h-5 text-[#2563eb]" />
                    )}
                  </div>

                  {fileName ? (
                    <p className="text-xs font-semibold text-[#2563eb] truncate max-w-xs">{fileName}</p>
                  ) : (
                    <>
                      <p className="text-xs font-semibold text-slate-700">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        PDF, JPG, PNG (Max 5MB)
                      </p>
                    </>
                  )}
                </div>
              </div>
              {errors.idDocument && <p className="text-red-500 text-[11px] mt-1">{errors.idDocument}</p>}
            </div>

            {/* Access Level Alert Box */}
            <div className="bg-[#eef4ff] rounded-xl p-3.5 flex items-start gap-3 border border-blue-100/60 my-4">
              <div className="w-5 h-5 rounded-full bg-[#2563eb] text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                i
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">Access Level</h4>
                <p className="text-[11px] text-slate-600 leading-normal mt-0.5">
                  Permissions are assigned after verification based on designation.
                </p>
              </div>
            </div>

            {/* Bottom Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleBack}
                className="w-1/3 py-2.5 px-4 rounded-lg border border-[#2563eb] text-[#2563eb] font-semibold text-xs sm:text-sm hover:bg-blue-50 transition-colors cursor-pointer text-center"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 py-2.5 px-4 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer text-center disabled:opacity-75"
              >
                {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
              </button>
            </div>

          </form>

        </div>
      </div>

    </div>
  );
};

export default OfficialVerification;
