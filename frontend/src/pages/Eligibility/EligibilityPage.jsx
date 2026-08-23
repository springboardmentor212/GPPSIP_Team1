import React, { useState } from 'react';
import EligibilityStepper from '../../components/common/EligibilityStepper';
import FormCard from '../../components/common/FormCard';
import EligibilityForm from '../../components/forms/EligibilityForm';
import NextButton from '../../components/common/NextButton';
import SchemeCard from '../../components/cards/SchemeCard';
import { checkSchemeEligibility } from '../../services/eligibility.service';
import { getSchemes } from '../../services/scheme.service';
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
  const [eligibilityResult, setEligibilityResult] = useState(null);
  
  const [schemes, setSchemes] = useState([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState('');

  // Fetch schemes on mount
  React.useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await getSchemes();
        if (res.success && Array.isArray(res.schemes)) {
          setSchemes(res.schemes);
        }
      } catch (err) {
        console.error("Failed to load schemes for eligibility check", err);
      }
    };
    fetchSchemes();
  }, []);

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

    if (!selectedSchemeId) {
      newErrors.scheme = "Please select a scheme to verify eligibility against";
    }

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

      const response = await checkSchemeEligibility(selectedSchemeId, mappedData);
      if (response.success) {
        setEligibilityResult({
          eligible: response.eligible,
          failedCriteria: response.failedCriteria || []
        });
        setStep(2);
      } else {
        addToast(response.message || "Failed to calculate eligibility.", 'error');
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
            
            {/* Scheme Selection */}
            <div className="flex flex-col">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">
                Target Scheme *
              </label>
              <select
                value={selectedSchemeId}
                onChange={(e) => {
                  setSelectedSchemeId(e.target.value);
                  if (errors.scheme) setErrors(prev => ({...prev, scheme: ''}));
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-bold bg-white transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/10 cursor-pointer ${
                  errors.scheme ? 'border-rose-400 focus:border-rose-400 text-rose-700' : 'border-slate-300 text-slate-700 focus:border-[#0052cc]'
                }`}
              >
                <option value="" disabled>-- Select a Government Scheme --</option>
                {schemes.map(s => (
                  <option key={s._id} value={s._id}>{s.title}</option>
                ))}
              </select>
              {errors.scheme && <p className="text-rose-500 text-[10px] font-bold mt-1.5">{errors.scheme}</p>}
            </div>

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
          {/* Results Display */}
          <div className="w-full max-w-2xl mx-auto">
            {eligibilityResult?.eligible ? (
              <div className="bg-white rounded-3xl border border-green-200 shadow-sm overflow-hidden text-center p-12">
                <FaCheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">You are Eligible!</h3>
                <p className="text-sm font-semibold text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
                  Great news! Based on the credentials provided, you meet all the eligibility criteria for the selected scheme.
                </p>

                <div className="mt-8 mb-8 text-left bg-emerald-50 rounded-2xl p-6 border border-emerald-100 max-w-lg mx-auto">
                  <h4 className="text-sm font-black text-emerald-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FaFileAlt className="text-emerald-600" /> Application Guidance
                  </h4>
                  <ol className="list-decimal pl-5 space-y-3 text-xs font-semibold text-emerald-800">
                    <li>Prepare your Aadhar Card, Income Certificate, and recent passport-size photographs.</li>
                    <li>Ensure your linked bank account is active for direct benefit transfers (DBT).</li>
                    <li>Click the button below to navigate to the official application portal.</li>
                    <li>Complete the registration using your verified credentials.</li>
                  </ol>
                </div>

                <button 
                  onClick={() => window.open('https://www.india.gov.in', '_blank')}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold shadow-md shadow-green-600/20 transition-all cursor-pointer border-none"
                >
                  Proceed to Official Portal
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-rose-200 shadow-sm overflow-hidden text-center p-12">
                <FaTimesCircle className="w-20 h-20 text-rose-500 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Not Eligible</h3>
                <p className="text-sm font-semibold text-slate-500 mb-6 max-w-md mx-auto leading-relaxed">
                  Unfortunately, you do not meet the criteria for this scheme based on the details provided.
                </p>
                
                {eligibilityResult?.failedCriteria?.length > 0 && (
                  <div className="text-left bg-rose-50 rounded-xl p-5 border border-rose-100 max-w-sm mx-auto">
                    <h4 className="text-xs font-black text-rose-800 uppercase tracking-wider mb-3">Failed Criteria</h4>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs font-bold text-rose-700">
                      {eligibilityResult.failedCriteria.map(c => (
                        <li key={c}>{c.toUpperCase()}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>  
        </div>
      )}

    </div>
  );
};

export default EligibilityPage;
