import React, { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { State, City } from 'country-state-city';
import SearchableDropdown from '../components/SearchableDropdown';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    dob: '',
    password: '',
    confirmPassword: '',
    state: '',
    district: '',
    role: 'Citizen',
    termsAccepted: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all Indian states and sort them alphabetically
  const statesList = useMemo(() => {
    return State.getStatesOfCountry('IN')
      .map((s) => s.name)
      .sort((a, b) => a.localeCompare(b));
  }, []);

  // Fetch cities/districts dynamically based on the selected state
  const districtsList = useMemo(() => {
    if (!formData.state) return [];
    const stateObj = State.getStatesOfCountry('IN').find((s) => s.name === formData.state);
    if (!stateObj) return [];
    return City.getCitiesOfState('IN', stateObj.isoCode)
      .map((c) => c.name)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort((a, b) => a.localeCompare(b));
  }, [formData.state]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'state' ? { district: '' } : {}) // Reset district if state changes
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleSelect = (roleName) => {
    setFormData((prev) => ({ ...prev, role: roleName }));
    if (errors.role) {
      setErrors((prev) => ({ ...prev, role: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile Number is required';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile Number must be 10 digits';
    }
    
    if (!formData.dob) {
      newErrors.dob = 'Date of Birth is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.district) newErrors.district = 'District is required';
    if (!formData.termsAccepted) newErrors.termsAccepted = 'You must accept the terms';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      setTimeout(() => {
        alert('Registration successful! (Integration with database is pending)');
        setIsSubmitting(false);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f0f4f9] text-slate-800 lg:h-screen lg:overflow-hidden">
      
      {/* LEFT PANEL - Blue themed hero image with Indian grandmother/child */}
      <div className="relative w-full lg:w-[42%] xl:w-[40%] bg-[#0047b3] flex flex-col justify-between p-8 sm:p-12 lg:h-full overflow-hidden shrink-0">
        
        {/* Background Image of Indian Grandmother & Child */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 opacity-90 transform scale-105"
          style={{ 
            backgroundImage: `url('/register_hero.jpg')` 
          }}
        />

        {/* Overlays matching branding and tone */}
        <div className="absolute inset-0 bg-[#0052cc]/30 mix-blend-color pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-blue-900/20 to-transparent pointer-events-none z-10" />


        {/* Top Left PolicyGPT Logo */}
        <div className="relative z-20 flex items-center gap-2">
          <div className="flex items-end gap-0.5 h-6 shrink-0">
            <div className="w-[10px] h-[14px] bg-white rounded-tl-[2px] rounded-bl-[2px] opacity-90" />
            <div className="w-[10px] h-[22px] bg-white rounded-tr-[2px] rounded-br-[2px] opacity-100" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight ml-0.5">PolicyGPT</span>
        </div>

        {/* Center Bottom Text */}
        <div className="relative z-20 mt-32 lg:mt-auto text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
            Empowering Every Citizen Through AI.
          </h1>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed font-light max-w-md">
            Simple. Secure. Accessible. Helping every citizen discover the right government schemes effortlessly.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL - Forms and input cards */}
      <div className="w-full lg:w-[58%] xl:w-[60%] flex items-center justify-center p-4 sm:p-6 lg:p-8 lg:h-full lg:overflow-y-auto shrink-0">
        <div className="w-full max-w-[490px] bg-white rounded-[24px] border border-slate-300 shadow-md p-5 sm:p-6 transition-all">

          
          {/* Card Header */}
          <div className="text-center mb-4.5">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Create Your Account</h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
              Join PolicyGPT to receive personalized government scheme recommendations and AI-powered assistance.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            
            {/* Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2.5">
              
              {/* Full Name */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className={`w-full px-3 py-2 rounded-lg border bg-white text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 placeholder-slate-400 shadow-sm transition-all ${
                    errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-[#0052cc]'
                  }`}
                />
                {errors.fullName && <p className="text-red-500 text-[10px] mt-0.5">{errors.fullName}</p>}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  className={`w-full px-3 py-2 rounded-lg border bg-white text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 placeholder-slate-400 shadow-sm transition-all ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-[#0052cc]'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-[10px] mt-0.5">{errors.email}</p>}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Mobile Number</label>
                <input 
                  type="text" 
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  placeholder="Enter 10-digit number"
                  className={`w-full px-3 py-2 rounded-lg border bg-white text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 placeholder-slate-400 shadow-sm transition-all ${
                    errors.mobile ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-[#0052cc]'
                  }`}
                />
                {errors.mobile && <p className="text-red-500 text-[10px] mt-0.5">{errors.mobile}</p>}
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Date of Birth</label>
                <input 
                  type="date" 
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  placeholder="mm/dd/yyyy"
                  className={`w-full px-3 py-2 rounded-lg border bg-white text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 placeholder-slate-400 shadow-sm transition-all ${
                    errors.dob ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-[#0052cc]'
                  }`}
                />
                {errors.dob && <p className="text-red-500 text-[10px] mt-0.5">{errors.dob}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Password</label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  className={`w-full px-3 py-2 rounded-lg border bg-white text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 placeholder-slate-400 shadow-sm transition-all ${
                    errors.password ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-[#0052cc]'
                  }`}
                />
                {errors.password && <p className="text-red-500 text-[10px] mt-0.5">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Confirm Password</label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Re-enter password"
                  className={`w-full px-3 py-2 rounded-lg border bg-white text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 placeholder-slate-400 shadow-sm transition-all ${
                    errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-[#0052cc]'
                  }`}
                />
                {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-0.5">{errors.confirmPassword}</p>}
              </div>

              {/* State Select */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">State</label>
                <SearchableDropdown
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  options={statesList}
                  placeholder="Select State"
                  error={errors.state}
                />
                {errors.state && <p className="text-red-500 text-[10px] mt-0.5">{errors.state}</p>}
              </div>

              {/* District Select */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">District</label>
                <SearchableDropdown
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  options={districtsList}
                  placeholder="Select District"
                  disabled={!formData.state}
                  error={errors.district}
                />
                {errors.district && <p className="text-red-500 text-[10px] mt-0.5">{errors.district}</p>}
              </div>

            </div>

            {/* Role Selection section */}
            <div className="pt-0.5">
              <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Select Your Role</label>
              <div className="grid grid-cols-3 gap-2.5">
                {/* Role 1: Citizen */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('Citizen')}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    formData.role === 'Citizen'
                      ? 'border-[#0052cc] bg-[#f0f5ff] text-[#0052cc]'
                      : 'border-slate-300 bg-white hover:border-slate-400 text-slate-600'
                  }`}
                >
                  <svg className="w-4.5 h-4.5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span className="text-[10px] font-bold tracking-tight">Citizen</span>
                </button>

                {/* Role 2: Government Official */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('Gov. Official')}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    formData.role === 'Gov. Official'
                      ? 'border-[#0052cc] bg-[#f0f5ff] text-[#0052cc]'
                      : 'border-slate-300 bg-white hover:border-slate-400 text-slate-600'
                  }`}
                >
                  <svg className="w-4.5 h-4.5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-[10px] font-bold tracking-tight">Gov. Official</span>
                </button>

                {/* Role 3: Researcher / NGO */}
                <button
                  type="button"
                  onClick={() => handleRoleSelect('Researcher/NGO')}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all cursor-pointer ${
                    formData.role === 'Researcher/NGO'
                      ? 'border-[#0052cc] bg-[#f0f5ff] text-[#0052cc]'
                      : 'border-slate-300 bg-white hover:border-slate-400 text-slate-600'
                  }`}
                >
                  <svg className="w-4.5 h-4.5 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 113.536 0V21h2v-2.243a5 5 0 01-3.536 0z" />
                  </svg>
                  <span className="text-[10px] font-bold tracking-tight text-ellipsis overflow-hidden whitespace-nowrap w-full">Res./NGO</span>
                </button>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-0.5">
              <label className="flex items-start gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleInputChange}
                  className="mt-0.5 rounded border-slate-350 text-[#0052cc] focus:ring-[#0052cc]/20 shadow-sm"
                />
                <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-snug select-none">
                  By creating an account, I agree to the <span className="text-[#0052cc] hover:underline font-bold">Terms of Service</span> and <span className="text-[#0052cc] hover:underline font-bold">Privacy Policy</span> of PolicyGPT.
                </span>
              </label>
              {errors.termsAccepted && <p className="text-red-500 text-[10px] mt-0.5">{errors.termsAccepted}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-lg text-xs sm:text-sm font-bold bg-[#0052cc] hover:bg-[#0047b3] text-white tracking-wide shadow-sm transition-colors duration-200 select-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating Account...
                  </>
                ) : 'Create Account'}
              </button>
            </div>

            {/* Bottom Redirect */}
            <div className="text-center pt-0.5">
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium select-none">
                Already have an account?{' '}
                <Link to="/login" className="text-[#0052cc] hover:text-[#0047b3] font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </div>

          </form>

        </div>
      </div>

    </div>
  );
};

export default Register;
