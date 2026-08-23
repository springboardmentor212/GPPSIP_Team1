import React, { useState } from 'react';
import EligibilityStepper from '../../components/common/EligibilityStepper';
import FormCard from '../../components/common/FormCard';
import EligibilityForm from '../../components/forms/EligibilityForm';
import NextButton from '../../components/common/NextButton';
import SchemeCard from '../../components/cards/SchemeCard';
import { getRecommendations } from '../../services/recommendation.service';
import { FaChevronLeft, FaSearch, FaCheckCircle, FaTimesCircle, FaFileAlt } from 'react-icons/fa';
import { useToast } from '../../hooks/useToast';

const EligibilityPage = () => {
  const [step, setStep] = useState(1);
  const { addToast } = useToast();
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
  const [recommendedSchemes, setRecommendedSchemes] = useState([]);

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

  const [bookmarkedIds, setBookmarkedIds] = useState([]);

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
      // Map frontend form to backend expectations
      const mappedData = {
        age: parseInt(formData.age, 10),
        gender: formData.gender,
        income: parseFloat(formData.annualIncome),
        occupation: formData.occupation,
        education: formData.education,
        location: formData.state, // Backend expects location
        socialCategory: formData.socialCategory,
        disabilityStatus: formData.disabilityStatus === 'Yes' // Convert to boolean
      };

      const response = await getRecommendations(mappedData);
      if (response.success) {
        setRecommendedSchemes(response.schemes);
        setStep(2);
      } else {
        addToast("Failed to fetch recommendations.", 'error');
      }
    } catch (error) {
      console.error(error);
      addToast("An error occurred while assessing eligibility.", 'error');
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
          subtitle="Select a scheme and provide your details to verify eligibility."
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
                text="Discover Schemes"
              />
            </div>
          </div>
        </FormCard>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Recommended for You</h2>
              <p className="text-sm font-semibold text-slate-500 mt-1">Based on your credentials, here are the schemes you are most eligible for.</p>
            </div>
            <button 
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors bg-white cursor-pointer"
            >
              <FaChevronLeft /> Edit Details
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {recommendedSchemes.length > 0 ? (
              recommendedSchemes.map(scheme => (
                <SchemeCard 
                  key={scheme._id}
                  scheme={{
                    id: scheme._id,
                    displayId: scheme.displayId || scheme._id.substring(0, 8).toUpperCase(),
                    title: scheme.title,
                    description: scheme.description,
                    category: scheme.category,
                    matchPercentage: scheme.matchPercentage,
                    eligibilityTag: scheme.eligibilityTag
                  }}
                  isBookmarked={bookmarkedIds.includes(scheme._id)}
                  onBookmark={() => handleBookmarkToggle(scheme._id)}
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-3xl">
                <FaTimesCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-600">No schemes match your profile</h3>
                <p className="text-sm font-semibold text-slate-400 mt-2">Try adjusting your eligibility details.</p>
              </div>
            )}
          </div>  
        </div>
      )}

    </div>
  );
};

export default EligibilityPage;
