import React from 'react';
import InputField from './InputField';
import SelectField from './SelectField';
import StateDropdown from './StateDropdown';
import DistrictDropdown from './DistrictDropdown';

const EligibilityForm = ({ formData, errors, onChange, disabled }) => {
  const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];
  
  const occupationOptions = [
    "Student", 
    "Salaried Employee", 
    "Self-Employed", 
    "Unemployed", 
    "Retired", 
    "Business Owner"
  ];

  const educationOptions = [
    "Below High School",
    "High School Graduate",
    "Under Graduate",
    "Post Graduate",
    "Doctorate"
  ];

  const categoryOptions = ["General", "OBC", "SC", "ST", "EWS"];
  const disabilityOptions = ["Yes", "No"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {/* Age */}
      <InputField
        label="Age"
        name="age"
        type="number"
        value={formData.age}
        onChange={onChange}
        placeholder="Enter your age"
        error={errors.age}
        disabled={disabled}
      />

      {/* Gender */}
      <SelectField
        label="Gender"
        name="gender"
        value={formData.gender}
        onChange={onChange}
        options={genderOptions}
        placeholder="Select Gender"
        error={errors.gender}
        disabled={disabled}
      />

      {/* Annual Income */}
      <InputField
        label="Annual Income (₹)"
        name="annualIncome"
        type="number"
        value={formData.annualIncome}
        onChange={onChange}
        placeholder="Enter your annual income in ₹"
        error={errors.annualIncome}
        disabled={disabled}
      />

      {/* Occupation */}
      <SelectField
        label="Occupation"
        name="occupation"
        value={formData.occupation}
        onChange={onChange}
        options={occupationOptions}
        placeholder="Select Occupation"
        error={errors.occupation}
        disabled={disabled}
      />

      {/* Education */}
      <SelectField
        label="Education"
        name="education"
        value={formData.education}
        onChange={onChange}
        options={educationOptions}
        placeholder="Select Education"
        error={errors.education}
        disabled={disabled}
      />

      {/* State */}
      <StateDropdown
        value={formData.state}
        onChange={onChange}
        error={errors.state}
        disabled={disabled}
      />

      {/* District */}
      <DistrictDropdown
        state={formData.state}
        value={formData.district}
        onChange={onChange}
        error={errors.district}
        disabled={disabled}
      />

      {/* Social Category */}
      <SelectField
        label="Social Category"
        name="socialCategory"
        value={formData.socialCategory}
        onChange={onChange}
        options={categoryOptions}
        placeholder="Select Category"
        error={errors.socialCategory}
        disabled={disabled}
      />

      {/* Disability Status */}
      <SelectField
        label="Disability Status"
        name="disabilityStatus"
        value={formData.disabilityStatus}
        onChange={onChange}
        options={disabilityOptions}
        placeholder="Select Option"
        error={errors.disabilityStatus}
        disabled={disabled}
      />
    </div>
  );
};

export default EligibilityForm;
