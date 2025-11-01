import React from 'react';

const Stepper = ({ currentStep, steps }) => {
  return (
    <div className="mb-8 md:mb-12">
      {/* Desktop: Horizontal Layout */}
      <div className="hidden md:flex items-start relative">
        {/* Connecting lines background */}
        <div className="absolute left-12 right-12 top-6 flex">
          {steps.slice(0, -1).map((_, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            return (
              <div key={index} className="flex-1 mx-2">
                <div
                  className={`h-1 rounded-full transition-all duration-300 ${
                    isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              </div>
            );
          })}
        </div>
        
        {/* Steps with circles and labels */}
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <div key={index} className="flex flex-col items-center flex-1 relative z-10">
              {/* Circle */}
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full text-base font-bold transition-all duration-300 shadow-md ${
                  isCompleted || isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {stepNumber}
              </div>
              
              {/* Label */}
              <span
                className={`mt-3 text-sm font-semibold text-center whitespace-nowrap ${
                  isCompleted || isActive ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile: Vertical/Compact Layout */}
      <div className="md:hidden flex flex-col space-y-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <div key={index} className="flex items-center">
              {/* Circle */}
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-all duration-300 shadow-md flex-shrink-0 ${
                  isCompleted || isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {stepNumber}
              </div>
              
              {/* Label */}
              <span
                className={`ml-4 text-sm font-semibold ${
                  isCompleted || isActive ? 'text-blue-600' : 'text-gray-500'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;

