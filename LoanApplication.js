import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Info, DollarSign, Calendar, PieChart, CreditCard, Briefcase, Building, UserPlus } from 'lucide-react';

const LoanApplication = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isNextDisabled, setIsNextDisabled] = useState(true);

  const steps = useMemo(() => [
    {
      title: "Loan Amount",
      question: "How much funding are you looking for?",
      type: "select",
      options: ["$10,000 - $50,000", "$50,001 - $100,000", "$100,001 - $250,000", "$250,001+"],
      icon: DollarSign,
      explanation: "Select the range that best fits your funding needs. This helps us determine the most suitable loan options for your business."
    },
    {
      title: "Business Start Date",
      question: "When did you start your business?",
      type: "date",
      icon: Calendar,
      explanation: "The age of your business helps us assess its stability and growth potential, which are factors in determining loan eligibility."
    },
    {
      title: "Monthly Revenue",
      question: "On average, how much revenue does your business currently generate each month?",
      type: "select",
      options: ["$0", "$1 - $4K", "$5K - $7K", "$8K - $14K", "$15K - $19K", "$20K - $49K", "$50K - $79K", "$80K - $199K", "$200K+"],
      icon: PieChart,
      explanation: "Your monthly revenue gives us insight into your business's cash flow and ability to repay the loan."
    },
    {
      title: "Important Factor",
      question: "Which is most important to you?",
      type: "select",
      options: ["Amount of Funds", "Speed of Funds", "Cost of Funds"],
      icon: DollarSign,
      explanation: "Understanding your priority helps us tailor the loan options to better meet your needs."
    },
    {
      title: "Credit Score",
      question: "What's your estimated FICO score?",
      type: "fico",
      options: ['499 or below', '500 - 599', '600 - 649', '650 - 679', '680 - 719', '720 or above'],
      icon: CreditCard,
      explanation: "Your credit score is one factor we consider in assessing your loan application. Don't worry if it's not perfect - we look at the overall picture of your business."
    },
    {
      title: "Business Type",
      question: "What type of entity is your business?",
      type: "select",
      options: ["LLC", "Corporation", "Sole Proprietor", "Legal Partnership"],
      icon: Briefcase,
      explanation: "Your business structure can affect the types of loans you're eligible for and the application process."
    },
    {
      title: "Industry",
      question: "What industry is your business in?",
      type: "select",
      options: ["Retail", "Services", "Manufacturing", "Technology", "Healthcare", "Construction", "Other"],
      icon: Building,
      explanation: "Different industries have different financial characteristics. This helps us understand your business's specific needs and challenges."
    },
    {
      title: "Use of Funds",
      question: "How do you plan to use the funds?",
      type: "select",
      options: ["Expansion", "Equipment Purchase", "Working Capital", "Debt Refinancing", "Inventory", "Marketing", "Other"],
      icon: DollarSign,
      explanation: "Understanding how you plan to use the funds helps us recommend the most appropriate financing options for your needs."
    },
    {
      title: "Contact Information",
      question: "Please provide your contact details",
      type: "contact",
      icon: UserPlus,
      explanation: "We'll use this information to contact you about your loan application and potential offers."
    }
  ], []);

  const checkNextButtonStatus = useCallback(() => {
    const currentStep = steps[step];
    let isComplete = false;

    if (currentStep) {
      switch (currentStep.type) {
        case 'select':
          isComplete = !!formData[currentStep.title];
          break;
        case 'date':
          isComplete = !!formData['StartMonth'] && !!formData['StartYear'];
          break;
        case 'fico':
          isComplete = !!formData[currentStep.title];
          break;
        case 'contact':
          isComplete = !!formData['FirstName'] && !!formData['LastName'] && !!formData['Email'] && !!formData['Phone'];
          break;
        default:
          isComplete = false;
      }
    }

    setIsNextDisabled(!isComplete);
  }, [formData, step, steps]);

  useEffect(() => {
    checkNextButtonStatus();
  }, [formData, step, checkNextButtonStatus]);

  const handleNext = () => {
    if (step === 1) {
      const startYear = parseInt(formData['StartYear']);
      const currentYear = new Date().getFullYear();
      if (currentYear - startYear < 1) {
        setStep('creditCardIntro');
        return;
      }
    } else if (step === 4 && formData['Credit Score'] === '499 or below') {
      setStep('creditRepair');
      return;
    }

    if (typeof step === 'number' && step < steps.length - 1) {
      setStep(step + 1);
    } else {
      console.log("Form submitted", formData);
      // Here you would typically send the data to your backend
    }
  };

  const handleBack = () => {
    if (step === 'creditCardIntro' || step === 'creditRepair') {
      setStep(step - 1);
    } else if (typeof step === 'number' && step > 0) {
      setStep(step - 1);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const renderInput = () => {
    const currentStep = steps[step];
    if (!currentStep) return null;

    switch (currentStep.type) {
      case 'select':
        return (
          <div className="flex flex-wrap -mx-2">
            {currentStep.options.map((option) => (
              <div key={option} className="w-1/2 px-2 mb-4">
                <button
                  className={`w-full p-3 border rounded-md transition duration-150 ease-in-out ${
                    formData[currentStep.title] === option 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => handleChange(currentStep.title, option)}
                >
                  {option}
                </button>
              </div>
            ))}
          </div>
        );
      case 'date':
        return (
          <div className="flex space-x-4">
            <select 
              className="w-1/2 p-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              onChange={(e) => handleChange('StartMonth', e.target.value)}
              value={formData['StartMonth'] || ''}
            >
              <option value="">Month</option>
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
                <option key={index} value={month}>{month}</option>
              ))}
            </select>
            <input 
              type="number"
              placeholder="Year"
              className="w-1/2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleChange('StartYear', e.target.value)}
              value={formData['StartYear'] || ''}
            />
          </div>
        );
      case 'fico':
        return (
          <div className="flex flex-wrap -mx-2">
            {currentStep.options.map((range) => (
              <div key={range} className="w-1/2 px-2 mb-4">
                <button
                  className={`w-full p-3 border rounded-md transition duration-150 ease-in-out ${
                    formData[currentStep.title] === range 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => handleChange(currentStep.title, range)}
                >
                  {range}
                </button>
              </div>
            ))}
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleChange('FirstName', e.target.value)}
              value={formData['FirstName'] || ''}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleChange('LastName', e.target.value)}
              value={formData['LastName'] || ''}
            />
            <input
              type="email"
              placeholder="Email Address"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleChange('Email', e.target.value)}
              value={formData['Email'] || ''}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => handleChange('Phone', e.target.value)}
              value={formData['Phone'] || ''}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const renderCreditCardIntro = () => (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Business Credit Cards</h2>
      <p className="text-lg text-gray-600 mb-8">
        Since your business is less than a year old, we recommend looking into business credit cards. They can help you build credit and manage expenses as your business grows.
      </p>
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
        onClick={() => console.log('Redirect to credit card offers')}
      >
        Learn More About Credit Cards
      </button>
    </div>
  );

  const renderCreditRepair = () => (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Credit Repair Services</h2>
      <p className="text-lg text-gray-600 mb-8">
        It looks like your credit score is below 500. We recommend working with a credit repair service to improve your score before applying for a business loan.
      </p>
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out"
        onClick={() => console.log('Redirect to credit repair services')}
      >
        Learn More About Credit Repair
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-0">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden md:flex">
        <div className="md:w-1/2 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-blue-900">SBG Funding</h1>
            <img src="/sbg-logo.png" alt="SBG Funding Logo" className="h-8" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            See how much your business is eligible for.
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Find out in minutes with our simplified application.
          </p>
          
          <div>
            {step === 'creditCardIntro' && renderCreditCardIntro()}
            {step === 'creditRepair' && renderCreditRepair()}
            {typeof step === 'number' && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-blue-600 flex items-center">
                    {React.createElement(steps[step].icon, { className: "mr-2" })}
                    {steps[step].title}
                  </h3>
                  <div className="relative group">
                    <Info size={20} className="text-blue-400 cursor-pointer" />
                    <div className="absolute right-0 w-64 p-2 bg-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm text-gray-600 z-10">
                      {steps[step].explanation}
                    </div>
                  </div>
                </div>
                
                <p className="text-lg font-medium text-gray-700 mb-4">{steps[step].question}</p>
                
                {renderInput()}
                
                <div className="flex justify-between mt-8">
                  <button 
                    onClick={handleBack}
                    className={`flex items-center text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out ${step === 0 ? 'invisible' : ''}`}
                  >
                    <ChevronLeft size={20} />
                    Back
                  </button>
                  <button 
                    onClick={handleNext}
                    className={`bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out flex items-center ${isNextDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isNextDisabled}
                  >
                    {step === steps.length - 1 ? 'Submit' : 'Next'}
                    <ChevronRight size={20} className="ml-2" />
                  </button>
                </div>
              </>
            )}
          </div>
          
          <p className="text-sm text-gray-500 mt-6 text-center">
            Applying is free and won't impact your credit score.
          </p>
        </div>
        
        <div className="md:w-1/2 bg-cover bg-center hidden md:block" style={{backgroundImage: "url('/business-funding.jpg')"}}>
          {/* Replace with your actual image */}
        </div>
      </div>
    </div>
  );
};

export default LoanApplication;
