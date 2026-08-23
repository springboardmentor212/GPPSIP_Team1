import React, { useState, useEffect, useMemo } from 'react';
import { 
  FaUser, 
  FaEnvelope, 
  FaBuilding, 
  FaBriefcase, 
  FaPen, 
  FaCheckCircle, 
  FaGlobe, 
  FaBell, 
  FaLock, 
  FaTrashAlt, 
  FaSave,
  FaQuestionCircle,
  FaTimes,
  FaPlus,
  FaExclamationTriangle
} from 'react-icons/fa';

// Import Reusable Components
import Modal from '../../components/modals/Modal';
import InputField from '../../components/forms/InputField';
import SelectField from '../../components/forms/SelectField';
import Footer from '../../components/layout/Footer';

// Import hooks & services
import useAuth from '../../hooks/useAuth';
import { 
  getProfileSettings, 
  updateProfileSettings, 
  changeUserPassword, 
  deleteCitizenAccount 
} from '../../services/profile.service';

const ProfilePage = () => {
  const { user, setUser, handleLogout } = useAuth();

  // Core profile loading/saving states
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Form validations state
  const [formErrors, setFormErrors] = useState({});

  // Editable fields state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [bio, setBio] = useState('');
  const [occupation, setOccupation] = useState('');
  const [education, setEducation] = useState('');
  const [income, setIncome] = useState('');

  // Interests state
  const [interestInput, setInterestInput] = useState('');
  const [interests, setInterests] = useState([]);

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'password' | 'delete' | null
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  // Toast status state
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: '' }

  // Load profile settings on mount
  const fetchProfileData = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getProfileSettings(user.email);
      if (response.success) {
        const prof = response.profile;
        setProfileData(prof);
        
        // Populate inputs
        setFullName(user.fullName || '');
        setEmail(user.email || '');
        setOrganization(prof.organization || '');
        setJobTitle(prof.jobTitle || '');
        setBio(prof.bio || '');
        setOccupation(prof.occupation || '');
        setEducation(prof.education || '');
        setIncome(prof.income || '');
        setInterests(prof.interests || []);
      }
    } catch (err) {
      setError("Failed to load profile parameters.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  // Handle toast helper auto-close
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Validations
  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullName.trim()) {
      errors.fullName = "Full Name is required.";
    } else if (fullName.trim().length < 3) {
      errors.fullName = "Full Name must be at least 3 characters.";
    } else if (fullName.trim().length > 50) {
      errors.fullName = "Full Name cannot exceed 50 characters.";
    }

    if (!email.trim()) {
      errors.email = "Email Address is required.";
    } else if (!emailRegex.test(email.trim())) {
      errors.email = "Please enter a valid email format.";
    }

    if (bio.length > 300) {
      errors.bio = "Bio cannot exceed 300 characters.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit profile alterations
  const handleSaveProfile = async () => {
    if (!validateForm()) {
      setToast({ type: 'error', message: 'Please correct validation issues.' });
      return;
    }

    setSaving(true);
    try {
      const updatedFields = {
        organization,
        jobTitle,
        bio,
        occupation,
        education,
        income: Number(income) || 0,
        interests
      };

      const response = await updateProfileSettings(user.email, updatedFields);
      if (response.success) {
        // Mock update the global AuthContext user name and email
        setUser(prev => ({
          ...prev,
          fullName: fullName.trim(),
          email: email.trim()
        }));

        setToast({ type: 'success', message: 'Personal Information saved successfully!' });
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Saving changes failed.' });
    } finally {
      setSaving(false);
    }
  };

  // Change Profile Image
  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      setSaving(true);
      try {
        const response = await updateProfileSettings(user.email, { profileImage: base64String });
        if (response.success) {
          setProfileData(prev => ({ ...prev, profileImage: base64String }));
          setToast({ type: 'success', message: 'Avatar image updated!' });
        }
      } catch (err) {
        setToast({ type: 'error', message: 'Failed to upload profile picture.' });
      } finally {
        setSaving(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Interests Chip management
  const handleAddInterest = () => {
    const trimmed = interestInput.trim();
    if (!trimmed) return;
    if (interests.some(i => i.toLowerCase() === trimmed.toLowerCase())) {
      setToast({ type: 'error', message: 'Interest already present.' });
      return;
    }
    const updated = [...interests, trimmed];
    setInterests(updated);
    setInterestInput('');
    
    // Auto-save tag addition
    updateProfileSettings(user.email, { interests: updated });
  };

  const handleRemoveInterest = (interestToRemove) => {
    const updated = interests.filter(i => i !== interestToRemove);
    setInterests(updated);
    
    // Auto-save tag deletion
    updateProfileSettings(user.email, { interests: updated });
  };

  // Switch Toggle Settings Change Handlers
  const handleNotificationToggle = async (key) => {
    if (!profileData) return;
    const updatedNotifs = {
      ...profileData.notifications,
      [key]: !profileData.notifications[key]
    };
    
    try {
      const response = await updateProfileSettings(user.email, { notifications: updatedNotifs });
      if (response.success) {
        setProfileData(prev => ({ ...prev, notifications: updatedNotifs }));
        setToast({ type: 'success', message: 'Notification preferences updated!' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update preferences.' });
    }
  };

  const handlePreferenceChange = async (key, val) => {
    if (!profileData) return;
    const updatedPrefs = {
      ...profileData.preferences,
      [key]: val
    };

    try {
      const response = await updateProfileSettings(user.email, { preferences: updatedPrefs });
      if (response.success) {
        setProfileData(prev => ({ ...prev, preferences: updatedPrefs }));
        setToast({ type: 'success', message: `${key} preferences updated!` });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to change configurations.' });
    }
  };

  const handle2FAToggle = async () => {
    if (!profileData) return;
    const nextVal = !profileData.twoFactorEnabled;

    try {
      const response = await updateProfileSettings(user.email, { twoFactorEnabled: nextVal });
      if (response.success) {
        setProfileData(prev => ({ ...prev, twoFactorEnabled: nextVal }));
        setToast({ type: 'success', message: `2-Factor Authentication ${nextVal ? 'Enabled' : 'Disabled'}!` });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update 2FA configuration.' });
    }
  };

  // Change Password form handlers
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordForm.currentPassword) {
      errors.currentPassword = "Current password is required.";
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required.";
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = "New password must be at least 8 characters.";
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) return;

    setSaving(true);
    try {
      const response = await changeUserPassword(passwordForm);
      if (response.success) {
        setToast({ type: 'success', message: 'Password changed successfully!' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setActiveModal(null);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Changing password failed.' });
    } finally {
      setSaving(false);
    }
  };

  // Account deletion confirmation
  const handleDeleteAccountConfirm = async () => {
    setSaving(true);
    try {
      const response = await deleteCitizenAccount(user.email);
      if (response.success) {
        setActiveModal(null);
        setToast({ type: 'success', message: 'Account deleted. Logging out...' });
        setTimeout(() => {
          handleLogout();
        }, 1500);
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Account deletion failed.' });
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-300 p-12 flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-10 h-10 border-4 border-[#0052cc] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs font-bold text-slate-400 mt-4 select-none">Retrieving profile settings parameters...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 flex flex-col justify-between min-h-full relative">
      
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl border shadow-xl flex items-center gap-3 text-xs font-bold select-none animate-in fade-in slide-in-from-top-5 duration-200 ${
          toast.type === 'success' 
            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
            : 'bg-rose-50 text-rose-700 border-rose-100'
        }`}>
          <FaCheckCircle className="w-4 h-4" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Settings Body */}
      <div className="flex-grow space-y-8">
        
        {/* Profile Overview Banner */}
        <div className="bg-white rounded-3xl border border-slate-300 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm select-none">
          <div className="relative group cursor-pointer">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleProfileImageChange}
              id="avatar-uploader" 
              className="hidden"
            />
            <label htmlFor="avatar-uploader" className="cursor-pointer block relative">
              {profileData?.profileImage ? (
                <img 
                  src={profileData.profileImage} 
                  alt={user.fullName} 
                  className="w-24 h-24 rounded-full object-cover border border-slate-300 shadow-inner group-hover:opacity-85 transition-opacity"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#0052cc] text-white text-3xl font-extrabold flex items-center justify-center uppercase shadow-inner group-hover:bg-[#0047b3] transition-colors">
                  {user.fullName ? user.fullName.charAt(0) : 'U'}
                </div>
              )}
              {/* Change edit pencil indicator */}
              <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-slate-205 flex items-center justify-center shadow-md text-slate-500 hover:text-[#0052cc] transition-colors">
                <FaPen className="w-3 h-3" />
              </div>
            </label>
          </div>

          <div className="text-center sm:text-left space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">
                {user.fullName}
              </h2>
            </div>
            <p className="text-xs font-semibold text-slate-400">
              {profileData?.jobTitle} &bull; Member since {profileData?.memberSince}
            </p>
            {/* Plan/Verification Badges */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#0052cc] border border-blue-100">
                <FaCheckCircle className="w-3 h-3 text-[#0052cc]" /> {user?.role || 'User'}
              </span>
            </div>
          </div>
        </div>

        {/* Reorganization into Grid Rows */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SECTION: Details & Interests (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Personal Information editable card */}
            <div className="bg-white rounded-3xl border border-slate-300 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6 select-none shrink-0">
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2 leading-none">
                  <FaUser className="text-[#0052cc]" /> Personal Information
                </h3>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-4 py-2 bg-[#0052cc] hover:bg-[#0047b3] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer border-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaSave className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Full Name"
                    name="fullName"
                    value={fullName}
                    onChange={(e) => { setFullName(e.target.value); setFormErrors(prev => ({ ...prev, fullName: null })); }}
                    placeholder="Enter full name"
                    error={formErrors.fullName}
                  />
                  <InputField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setFormErrors(prev => ({ ...prev, email: null })); }}
                    placeholder="Enter email address"
                    error={formErrors.email}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InputField
                    label="Organization"
                    name="organization"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Enter associated organization"
                  />
                  <InputField
                    label="Job Title"
                    name="jobTitle"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Enter professional role"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <InputField
                    label="Occupation"
                    name="occupation"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="E.g., Farmer, Student, etc."
                  />
                  <InputField
                    label="Education Level"
                    name="education"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    placeholder="E.g., High School, B.Tech"
                  />
                  <InputField
                    label="Annual Income (₹)"
                    name="income"
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    placeholder="E.g., 250000"
                  />
                </div>
                
                {/* Biography Textarea */}
                <div className="w-full flex flex-col text-left">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5 block">
                    Biography
                  </label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => { setBio(e.target.value); setFormErrors(prev => ({ ...prev, bio: null })); }}
                    placeholder="Provide a summary of your policy interests and credentials..."
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-bold text-slate-700 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all resize-none ${
                      formErrors.bio ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-[#0052cc]'
                    }`}
                  />
                  {formErrors.bio && (
                    <span className="text-[10px] text-red-550 font-bold mt-1 pl-1">{formErrors.bio}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Saved Policy Interests tags block */}
            <div className="bg-white rounded-3xl border border-slate-300 p-6 sm:p-8 shadow-sm text-left">
              <div className="border-b border-slate-200 pb-4 mb-6 select-none shrink-0">
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2 leading-none">
                  <FaGlobe className="text-[#0052cc]" /> Saved Policy Interests
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {interests.map((interest, i) => (
                  <span 
                    key={i} 
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-250 rounded-full text-xs font-bold text-slate-650 shadow-sm select-none"
                  >
                    <span>{interest}</span>
                    <button 
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer bg-transparent border-none p-0 flex items-center justify-center"
                    >
                      <FaTimes className="w-2.5 h-2.5" />
                    </button>
                  </span>
                ))}
                
                {/* Inline addition form tag input */}
                <div className="flex items-center border border-slate-350 bg-white rounded-full px-3 py-1 text-xs font-bold">
                  <input
                    type="text"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddInterest()}
                    placeholder="Add Topic"
                    className="border-none bg-transparent outline-none text-xs text-slate-700 placeholder-slate-400 font-bold max-w-[80px]"
                  />
                  <button 
                    type="button"
                    onClick={handleAddInterest}
                    className="text-[#0052cc] hover:text-[#0047b3] cursor-pointer bg-transparent border-none p-0 flex items-center justify-center font-black ml-1"
                  >
                    <FaPlus className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* App Preferences */}
            <div className="bg-white rounded-3xl border border-slate-300 p-6 sm:p-8 shadow-sm text-left">
              <div className="border-b border-slate-200 pb-4 mb-6 select-none shrink-0">
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2 leading-none">
                  <FaGlobe className="text-[#0052cc]" /> App Preferences
                </h3>
              </div>

              <div className="space-y-6">
                {/* Language Select */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="select-none">
                    <h4 className="text-xs font-extrabold text-slate-750 uppercase tracking-wider mb-1">Interface Language</h4>
                    <span className="text-xs text-slate-400 font-medium">Select your preferred system language.</span>
                  </div>
                  <select 
                    value={profileData?.preferences?.language} 
                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold bg-white text-slate-700 cursor-pointer focus:outline-none focus:border-[#0052cc]"
                  >
                    <option>English (US)</option>
                    <option>English (UK)</option>
                    <option>Hindi (हिंदी)</option>
                    <option>Marathi (मराठी)</option>
                  </select>
                </div>

                {/* Appearance toggle */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                  <div className="select-none">
                    <h4 className="text-xs font-extrabold text-slate-750 uppercase tracking-wider mb-1">Appearance</h4>
                    <span className="text-xs text-slate-400 font-medium">Switch between light and dark themes.</span>
                  </div>
                  <div className="flex bg-slate-100 p-1 rounded-xl select-none">
                    <button
                      type="button"
                      onClick={() => handlePreferenceChange('theme', 'Light')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-none ${
                        profileData?.preferences?.theme === 'Light'
                          ? 'bg-white text-[#0052cc] shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Light
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePreferenceChange('theme', 'Dark')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border-none ${
                        profileData?.preferences?.theme === 'Dark'
                          ? 'bg-white text-[#0052cc] shadow-sm'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      Dark
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SECTION: Notification, Security & Support (1/3 width) */}
          <div className="space-y-8">
            
            {/* Notification settings switches */}
            <div className="bg-white rounded-3xl border border-slate-300 p-6 sm:p-8 shadow-sm text-left select-none">
              <div className="border-b border-slate-200 pb-4 mb-6 shrink-0">
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2 leading-none">
                  <FaBell className="text-[#0052cc]" /> Notifications
                </h3>
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-750">Email Updates</span>
                  <input
                    type="checkbox"
                    checked={profileData?.notifications?.emailUpdates}
                    onChange={() => handleNotificationToggle('emailUpdates')}
                    className="rounded border-slate-350 text-[#0052cc] focus:ring-blue-500/10 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-750">New Policy Alerts</span>
                  <input
                    type="checkbox"
                    checked={profileData?.notifications?.newPolicyAlerts}
                    onChange={() => handleNotificationToggle('newPolicyAlerts')}
                    className="rounded border-slate-350 text-[#0052cc] focus:ring-blue-500/10 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-750">Weekly Reports</span>
                  <input
                    type="checkbox"
                    checked={profileData?.notifications?.weeklyReports}
                    onChange={() => handleNotificationToggle('weeklyReports')}
                    className="rounded border-slate-350 text-[#0052cc] focus:ring-blue-500/10 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-750">AI Research Digests</span>
                  <input
                    type="checkbox"
                    checked={profileData?.notifications?.aiDigests}
                    onChange={() => handleNotificationToggle('aiDigests')}
                    className="rounded border-slate-350 text-[#0052cc] focus:ring-blue-500/10 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Security settings */}
            <div className="bg-white rounded-3xl border border-slate-300 p-6 sm:p-8 shadow-sm text-left">
              <div className="border-b border-slate-200 pb-4 mb-6 select-none shrink-0">
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2 leading-none">
                  <FaLock className="text-[#0052cc]" /> Security
                </h3>
              </div>

              <div className="space-y-6">
                {/* Change Password button */}
                <button
                  type="button"
                  onClick={() => setActiveModal('password')}
                  className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer transition-colors shadow-sm"
                >
                  <span className="flex items-center gap-2"><FaLock className="text-slate-400" /> Change Password</span>
                  <span className="text-slate-400 font-extrabold">&rarr;</span>
                </button>

                {/* 2FA Toggle switch & status badge */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 select-none">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-750 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      Two-Factor Auth
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                        profileData?.twoFactorEnabled ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-200'
                      }`}>
                        {profileData?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </h4>
                  </div>
                  <input
                    type="checkbox"
                    checked={profileData?.twoFactorEnabled}
                    onChange={handle2FAToggle}
                    className="rounded border-slate-350 text-[#0052cc] focus:ring-blue-500/10 cursor-pointer"
                  />
                </div>

                {/* Danger Zone */}
                <div className="pt-4 border-t border-slate-100 text-left select-none">
                  <h4 className="text-[10px] font-black text-rose-550 uppercase tracking-wider mb-1">Danger Zone</h4>
                  <p className="text-[10px] text-slate-400 font-medium mb-3">
                    Permanently delete your profile account credentials and all related dossiers. This action cannot be reversed.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveModal('delete')}
                    className="w-full py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <FaTrashAlt className="inline-block mr-1.5 w-3 h-3" /> Delete Account
                  </button>
                </div>
              </div>
            </div>

            {/* Support Blue Card */}
            <div className="bg-[#0052cc] rounded-3xl p-6 sm:p-8 text-white text-left select-none shadow-lg shadow-blue-500/10">
              <FaQuestionCircle className="w-8 h-8 text-white/90 mb-4" />
              <h3 className="text-base font-black tracking-tight mb-2">Need assistance?</h3>
              <p className="text-xs text-white/80 leading-relaxed font-semibold mb-6">
                Our dedicated compliance and policy research staff is available to help resolve technical integration issues.
              </p>
              <button
                type="button"
                onClick={() => setToast({ type: 'success', message: 'Support ticket initiated.' })}
                className="w-full py-2.5 bg-white text-[#0052cc] hover:bg-slate-50 rounded-xl text-xs font-black transition-all border-none cursor-pointer"
              >
                Contact Support
              </button>
            </div>

          </div>

        </div>

      </div>

      <Footer />

      {/* MODALS SECTION */}

      {/* 1. Change Password Modal */}
      <Modal
        isOpen={activeModal === 'password'}
        onClose={() => setActiveModal(null)}
        title="Change Profile Password"
        actions={
          <>
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-650 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePasswordSubmit}
              className="px-4 py-2 bg-[#0052cc] hover:bg-[#0047b3] text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-none"
            >
              Update Password
            </button>
          </>
        }
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <InputField
            label="Current Password"
            name="currentPassword"
            type="password"
            value={passwordForm.currentPassword}
            onChange={handlePasswordInputChange}
            placeholder="Enter current password"
            error={passwordErrors.currentPassword}
          />
          <InputField
            label="New Password"
            name="newPassword"
            type="password"
            value={passwordForm.newPassword}
            onChange={handlePasswordInputChange}
            placeholder="Enter new password (min. 8 chars)"
            error={passwordErrors.newPassword}
          />
          <InputField
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordInputChange}
            placeholder="Confirm new password"
            error={passwordErrors.confirmPassword}
          />
        </form>
      </Modal>

      {/* 2. Delete Account Modal */}
      <Modal
        isOpen={activeModal === 'delete'}
        onClose={() => setActiveModal(null)}
        title="Confirm Account Deletion"
        actions={
          <>
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-650 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteAccountConfirm}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer border-none"
            >
              Confirm Account Deletion
            </button>
          </>
        }
      >
        <div className="text-center p-2 select-none">
          <FaExclamationTriangle className="text-rose-550 w-12 h-12 mb-4 mx-auto animate-bounce" />
          <h4 className="text-sm font-bold text-slate-700 mb-2">Delete your account permanently?</h4>
          <p className="text-xs text-slate-400 font-semibold leading-relaxed">
            This action will wipe all of your registered dossiers, application histories, and interests from this device. <strong>This process is final and irreversible.</strong>
          </p>
        </div>
      </Modal>

    </div>
  );
};

export default ProfilePage;
