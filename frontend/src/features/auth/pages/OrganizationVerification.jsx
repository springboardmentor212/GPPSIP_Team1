import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { FiUpload } from 'react-icons/fi';
import { HiOutlineDocumentText } from 'react-icons/hi';

const OrganizationVerification = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        organizationName: '',
        registrationNumber: '',
        researchDomain: '',
        organizationEmail: '',
        website: '',
        organizationAddress: '',
        district: '',
        pinCode: '',
        certificate: null
    });

    const [fileName, setFileName] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const domainsList = [
        'Select Domain',
        'Policy Research',
        'Public Health & Welfare',
        'Education & Skill Development',
        'Agriculture & Rural Development',
        'Economic Policy & Finance',
        'Environment & Climate',
        'Technology & AI in Governance',
        'Other'
    ];

    const districtsList = [
        'Select District',
        'Central Delhi',
        'East Delhi',
        'New Delhi',
        'North Delhi',
        'South Delhi',
        'Mumbai City',
        'Bengaluru Urban',
        'Hyderabad',
        'Chennai',
        'Kolkata',
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
                setErrors((prev) => ({ ...prev, certificate: 'File size must be max 5MB' }));
                return;
            }
            setFormData((prev) => ({ ...prev, certificate: file }));
            setFileName(file.name);
            if (errors.certificate) {
                setErrors((prev) => ({ ...prev, certificate: '' }));
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
        if (!formData.organizationName.trim()) newErrors.organizationName = 'Organization Name is required';
        if (!formData.registrationNumber.trim()) newErrors.registrationNumber = 'Registration Number is required';
        if (!formData.researchDomain || formData.researchDomain === 'Select Domain') {
            newErrors.researchDomain = 'Please select a research domain';
        }

        if (!formData.organizationEmail.trim()) {
            newErrors.organizationEmail = 'Organization Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.organizationEmail)) {
            newErrors.organizationEmail = 'Invalid email address';
        }

        if (!formData.organizationAddress.trim()) newErrors.organizationAddress = 'Organization Address is required';
        if (!formData.district || formData.district === 'Select District') {
            newErrors.district = 'Please select a district';
        }

        if (!formData.pinCode.trim()) {
            newErrors.pinCode = 'PIN Code is required';
        } else if (!/^\d{6}$/.test(formData.pinCode.trim())) {
            newErrors.pinCode = 'PIN Code must be 6 digits';
        }

        if (!formData.certificate) {
            newErrors.certificate = 'Please upload a registration certificate';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            setIsSubmitting(true);
            setTimeout(() => {
                setIsSubmitting(false);
                alert('Organization registration completed successfully!');
                navigate('/dashboard');
            }, 1000);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f0f4f9] text-slate-800 lg:h-screen lg:overflow-hidden font-sans">

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

            {/* RIGHT PANEL - Organization Information Form */}
            <div className="w-full lg:w-[58%] xl:w-[60%] flex items-center justify-center p-4 sm:p-6 lg:p-8 lg:h-full lg:overflow-y-auto shrink-0">
                <div className="w-full max-w-[500px] bg-white rounded-[24px] border border-slate-200 shadow-md p-6 sm:p-7 transition-all">

                    {/* Header */}
                    <div className="text-center mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                            Organization Information
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">
                            Complete your organization profile.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Row 1: Organization Name & Registration Number (2 Cols) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">

                            {/* Organization Name */}
                            <div className="relative">
                                <fieldset className={`border rounded-lg px-3 pb-2 pt-0.5 transition-all bg-white ${errors.organizationName ? 'border-red-500' : 'border-slate-300 focus-within:border-[#2563eb]'
                                    }`}>
                                    <legend className="text-[10px] font-semibold text-slate-500 px-1 select-none">
                                        Organization Name
                                    </legend>
                                    <input
                                        type="text"
                                        name="organizationName"
                                        value={formData.organizationName}
                                        onChange={handleInputChange}
                                        placeholder="e.g., Center for Policy Research"
                                        className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                                    />
                                </fieldset>
                                {errors.organizationName && <p className="text-red-500 text-[10px] mt-0.5 px-1">{errors.organizationName}</p>}
                            </div>

                            {/* Registration Number */}
                            <div className="relative">
                                <fieldset className={`border rounded-lg px-3 pb-2 pt-0.5 transition-all bg-white ${errors.registrationNumber ? 'border-red-500' : 'border-slate-300 focus-within:border-[#2563eb]'
                                    }`}>
                                    <legend className="text-[10px] font-semibold text-slate-500 px-1 select-none">
                                        Registration Number
                                    </legend>
                                    <input
                                        type="text"
                                        name="registrationNumber"
                                        value={formData.registrationNumber}
                                        onChange={handleInputChange}
                                        placeholder="e.g., NGO-123456"
                                        className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                                    />
                                </fieldset>
                                {errors.registrationNumber && <p className="text-red-500 text-[10px] mt-0.5 px-1">{errors.registrationNumber}</p>}
                            </div>

                        </div>

                        {/* Row 2: Research Domain & Organization Email (2 Cols) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">

                            {/* Research Domain */}
                            <div className="relative">
                                <fieldset className={`border rounded-lg px-3 pb-2 pt-0.5 transition-all bg-white ${errors.researchDomain ? 'border-red-500' : 'border-slate-300 focus-within:border-[#2563eb]'
                                    }`}>
                                    <legend className="text-[10px] font-semibold text-slate-500 px-1 select-none">
                                        Research Domain
                                    </legend>
                                    <div className="relative">
                                        <select
                                            name="researchDomain"
                                            value={formData.researchDomain}
                                            onChange={handleInputChange}
                                            className={`w-full bg-transparent text-xs sm:text-sm appearance-none cursor-pointer focus:outline-none pr-6 ${formData.researchDomain === '' || formData.researchDomain === 'Select Domain' ? 'text-slate-400' : 'text-slate-800'
                                                }`}
                                        >
                                            {domainsList.map((domain, index) => (
                                                <option key={index} value={domain} disabled={index === 0} className="text-slate-800">
                                                    {domain}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-slate-500">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </fieldset>
                                {errors.researchDomain && <p className="text-red-500 text-[10px] mt-0.5 px-1">{errors.researchDomain}</p>}
                            </div>

                            {/* Organization Email */}
                            <div className="relative">
                                <fieldset className={`border rounded-lg px-3 pb-2 pt-0.5 transition-all bg-white ${errors.organizationEmail ? 'border-red-500' : 'border-slate-300 focus-within:border-[#2563eb]'
                                    }`}>
                                    <legend className="text-[10px] font-semibold text-slate-500 px-1 select-none">
                                        Organization Email
                                    </legend>
                                    <input
                                        type="email"
                                        name="organizationEmail"
                                        value={formData.organizationEmail}
                                        onChange={handleInputChange}
                                        placeholder="contact@organization.org"
                                        className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                                    />
                                </fieldset>
                                {errors.organizationEmail && <p className="text-red-500 text-[10px] mt-0.5 px-1">{errors.organizationEmail}</p>}
                            </div>

                        </div>

                        {/* Row 3: Website (Full Width) */}
                        <div className="relative">
                            <fieldset className="border border-slate-300 rounded-lg px-3 pb-2 pt-0.5 transition-all bg-white focus-within:border-[#2563eb]">
                                <legend className="text-[10px] font-semibold text-slate-500 px-1 select-none">
                                    Website
                                </legend>
                                <input
                                    type="text"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    placeholder="https://www.organization.org"
                                    className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                                />
                            </fieldset>
                        </div>

                        {/* Row 4: Organization Address (Full Width) */}
                        <div className="relative">
                            <fieldset className={`border rounded-lg px-3 pb-2 pt-0.5 transition-all bg-white ${errors.organizationAddress ? 'border-red-500' : 'border-slate-300 focus-within:border-[#2563eb]'
                                }`}>
                                <legend className="text-[10px] font-semibold text-slate-500 px-1 select-none">
                                    Organization Address
                                </legend>
                                <input
                                    type="text"
                                    name="organizationAddress"
                                    value={formData.organizationAddress}
                                    onChange={handleInputChange}
                                    placeholder="Street Address, Building, etc."
                                    className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                                />
                            </fieldset>
                            {errors.organizationAddress && <p className="text-red-500 text-[10px] mt-0.5 px-1">{errors.organizationAddress}</p>}
                        </div>

                        {/* Row 5: District & PIN Code (2 Cols) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">

                            {/* District */}
                            <div className="relative">
                                <fieldset className={`border rounded-lg px-3 pb-2 pt-0.5 transition-all bg-white ${errors.district ? 'border-red-500' : 'border-slate-300 focus-within:border-[#2563eb]'
                                    }`}>
                                    <legend className="text-[10px] font-semibold text-slate-500 px-1 select-none">
                                        District
                                    </legend>
                                    <div className="relative">
                                        <select
                                            name="district"
                                            value={formData.district}
                                            onChange={handleInputChange}
                                            className={`w-full bg-transparent text-xs sm:text-sm appearance-none cursor-pointer focus:outline-none pr-6 ${formData.district === '' || formData.district === 'Select District' ? 'text-slate-400' : 'text-slate-800'
                                                }`}
                                        >
                                            {districtsList.map((dist, index) => (
                                                <option key={index} value={dist} disabled={index === 0} className="text-slate-800">
                                                    {dist}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-slate-500">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </fieldset>
                                {errors.district && <p className="text-red-500 text-[10px] mt-0.5 px-1">{errors.district}</p>}
                            </div>

                            {/* PIN Code */}
                            <div className="relative">
                                <fieldset className={`border rounded-lg px-3 pb-2 pt-0.5 transition-all bg-white ${errors.pinCode ? 'border-red-500' : 'border-slate-300 focus-within:border-[#2563eb]'
                                    }`}>
                                    <legend className="text-[10px] font-semibold text-slate-500 px-1 select-none">
                                        PIN Code
                                    </legend>
                                    <input
                                        type="text"
                                        name="pinCode"
                                        value={formData.pinCode}
                                        onChange={handleInputChange}
                                        placeholder="6 digits"
                                        className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                                    />
                                </fieldset>
                                {errors.pinCode && <p className="text-red-500 text-[10px] mt-0.5 px-1">{errors.pinCode}</p>}
                            </div>

                        </div>

                        {/* Row 6: Upload Registration Certificate */}
                        <div className="pt-1">
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                Upload Registration Certificate
                            </label>

                            <div
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer bg-white ${dragActive ? 'border-[#2563eb] bg-blue-50/40' : errors.certificate ? 'border-red-400 bg-red-50/20' : 'border-slate-300 hover:border-slate-400'
                                    }`}
                            >
                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileInput}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />

                                <div className="flex flex-col items-center justify-center">
                                    {/* Upload Icon Square */}
                                    <div className="w-9 h-9 rounded-lg bg-[#e0edff] text-[#2563eb] flex items-center justify-center mb-2">
                                        {fileName ? (
                                            <HiOutlineDocumentText className="w-5 h-5 text-[#2563eb]" />
                                        ) : (
                                            <FiUpload className="w-4 h-4 text-[#2563eb]" />
                                        )}
                                    </div>

                                    {fileName ? (
                                        <p className="text-xs font-semibold text-[#2563eb] truncate max-w-xs">{fileName}</p>
                                    ) : (
                                        <>
                                            <p className="text-xs font-normal text-slate-700">
                                                <span className="text-[#2563eb] font-semibold hover:underline">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">
                                                PDF, JPG, PNG (Max 5MB)
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                            {errors.certificate && <p className="text-red-500 text-[10px] mt-0.5">{errors.certificate}</p>}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3 pt-3">
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
                                {isSubmitting ? 'Completing...' : 'Complete Registration'}
                            </button>
                        </div>

                    </form>

                </div>
            </div>

        </div>
    );
};

export default OrganizationVerification;
