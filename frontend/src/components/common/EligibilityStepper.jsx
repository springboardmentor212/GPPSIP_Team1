import React from 'react';

const EligibilityStepper = ({ currentStep }) => {
  const steps = [
    { number: 1, label: "Basic Information" },
    { number: 2, label: "Recommended Schemes" }
  ];

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6 shrink-0 select-none pb-4">
      {steps.map((step, idx) => {
        const isActive = currentStep === step.number;
        const isCompleted = currentStep > step.number;

        return (
          <React.Fragment key={step.number}>
            <div className="flex items-center gap-2.5">
              {/* Stepper Circle */}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border transition-all ${
                isActive 
                  ? 'bg-[#0052cc] text-white border-[#0052cc] shadow-sm shadow-blue-500/10' 
                  : isCompleted 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-350'
                  : 'bg-white text-slate-400 border-slate-300'
              }`}>
                {step.number}
              </div>
              
              {/* Stepper Label */}
              <span className={`text-xs sm:text-sm font-extrabold transition-colors ${
                isActive 
                  ? 'text-slate-800 font-extrabold' 
                  : isCompleted 
                  ? 'text-emerald-600 font-extrabold'
                  : 'text-slate-400 font-bold'
              }`}>
                {step.label}
              </span>
            </div>

            {/* Connecting line */}
            {idx < steps.length - 1 && (
              <div className={`h-0.5 w-16 sm:w-24 transition-all duration-300 ${
                isCompleted ? 'bg-emerald-500' : 'bg-slate-250'
              }`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default EligibilityStepper;
