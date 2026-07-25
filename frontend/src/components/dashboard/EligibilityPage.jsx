import React, { useState } from 'react';
import EligibilityStepper from './EligibilityStepper';
import FormCard from './FormCard';
import EligibilityForm from './EligibilityForm';
import NextButton from './NextButton';
import SchemeCard from './SchemeCard';
import { checkEligibility } from '../../services/eligibility.api';
import { FaChevronLeft, FaSearch } from 'react-icons/fa';

const EligibilityPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    annualIncome: '',
    occupation: '',
    education: '',
    state: '',
    district: '',
    socialCategory: '',
    disabilityStatus: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  // Handles input values and dependent state resets
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'state' ? { district: '' } : {}) // Reset district if state changes
    }));
    
    // Clear field error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBookmarkToggle = (id) => {
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
    );
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate Age
    if (!formData.age) {
      newErrors.age = "Age is required";
    } else {
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        newErrors.age = "Age must be between 1 and 120";
      }
    }

    // Validate Annual Income
    if (!formData.annualIncome) {
      newErrors.annualIncome = "Annual Income is required";
    } else {
      const incomeNum = parseFloat(formData.annualIncome);
      if (isNaN(incomeNum) || incomeNum < 0) {
        newErrors.annualIncome = "Annual Income must be a positive number";
      }
    }

    // Validate other fields
    const requiredFields = [
      'gender', 
      'occupation', 
      'education', 
      'state', 
      'district', 
      'socialCategory', 
      'disabilityStatus'
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        // Format label for the error message
        const label = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        newErrors[field] = `${label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await checkEligibility(formData);
      if (response.success) {
        setRecommendations(response.recommendations);
        setStep(2);
      } else {
        alert(response.message || "Failed to calculate eligibility.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while assessing eligibility.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6 select-none">
      
      {/* Step Indicator Stepper */}
      <EligibilityStepper currentStep={step} />

      {/* Main Content Layout */}
      {step === 1 ? (
        <FormCard 
          title="Eligibility Assessment" 
          subtitle="Provide your demographic details to find the most relevant government schemes and policies."
        >
          <div className="space-y-6">
            <EligibilityForm 
              formData={formData}
              errors={errors}
              onChange={handleInputChange}
              disabled={loading}
            />

            {/* Next Button Row */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-end">
              <NextButton 
                onClick={handleNextStep}
                loading={loading}
                disabled={loading}
                text="Next"
              />
            </div>
          </div>
        </FormCard>
      ) : (
        <div className="space-y-6">
          
          {/* Header Row */}
          <div className="bg-white rounded-3xl border border-slate-300 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-none">
                Assessment Results
              </h2>
              <p className="text-xs sm:text-sm text-slate-450 font-light leading-relaxed max-w-xl">
                Based on your credentials, we have matched your profile with the following eligible government schemes.
              </p>
            </div>
            
            {/* Go Back button */}
            <button 
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition-colors shadow-sm cursor-pointer shrink-0"
            >
              <FaChevronLeft className="w-2.5 h-2.5 text-slate-400" />
              <span>Modify Details</span>
            </button>
          </div>

          {/* Scheme Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {recommendations.map((scheme) => (
              <div key={scheme.id}>
                <SchemeCard 
                  title={scheme.title}
                  ministry={scheme.ministry}
                  eligibilityTag={scheme.eligibilityTag}
                  matchPercentage={scheme.matchPercentage}
                  description={scheme.description}
                  maxBenefit={scheme.maxBenefit}
                  deadline={scheme.deadline}
                  tags={scheme.tags}
                  isBookmarked={bookmarkedIds.includes(scheme.id)}
                  onBookmarkToggle={() => handleBookmarkToggle(scheme.id)}
                  onApply={() => alert(`Applying for matching scheme: ${scheme.title}`)}
                />
              </div>
            ))}
            
            {recommendations.length === 0 && (
              <div className="col-span-2 py-16 text-center border border-dashed border-slate-350 bg-white rounded-2xl">
                <p className="text-sm font-bold text-slate-400">No matching schemes found for your current profile.</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

export default EligibilityPage;
