'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronRight, ChevronLeft, ShieldCheck, X, Building2, IndianRupee, Wallet, Briefcase, Store, Home, FileText, Car, GraduationCap, CheckCircle } from 'lucide-react';

interface ApplicationFormProps {
  loanType?: string;
}

const ApplicationForm = ({ loanType = 'personal' }: ApplicationFormProps) => {
  const router = useRouter();
  const isBusinessLoan = loanType === 'business';
  const isHomeLoan = loanType === 'home';
  const isLAP = loanType === 'lap';
  const isPersonalLoan = loanType === 'personal';
  const isCarLoan = loanType === 'car';
  const isEducationLoan = loanType === 'education';
  
  const isSubmittingRef = React.useRef(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  
  // Define steps based on loan type
  let steps = [
    { id: 1, title: 'Personal Details' },
    { id: 2, title: 'Employment Info' },
    { id: 3, title: 'Loan Requirement' },
    { id: 4, title: 'Review & Submit' },
  ];

  if (isBusinessLoan) {
    steps = [
      { id: 1, title: 'Basic Details' },
      { id: 2, title: 'Employment Info' },
      { id: 3, title: 'Business Details' },
      { id: 4, title: 'Loan Requirement' },
      { id: 5, title: 'Review & Submit' },
    ];
  } else if (isHomeLoan) {
    steps = [
      { id: 1, title: 'Basic Details' },
      { id: 2, title: 'Employment Info' },
      { id: 3, title: 'Property Details' },
      { id: 4, title: 'Review & Submit' },
    ];
  } else if (isLAP) {
    steps = [
      { id: 1, title: 'Basic Details' },
      { id: 2, title: 'Employment Info' },
      { id: 3, title: 'Property Info' },
      { id: 4, title: 'Review & Submit' },
    ];
  } else if (isCarLoan) {
    steps = [
      { id: 1, title: 'Basic Details' },
      { id: 2, title: 'Employment Info' },
      { id: 3, title: 'Vehicle Details' },
      { id: 4, title: 'Review & Submit' },
    ];
  } else if (isEducationLoan) {
    steps = [
      { id: 1, title: 'Basic Details' },
      { id: 2, title: 'Employment Info' },
      { id: 3, title: 'Education Details' },
      { id: 4, title: 'Review & Submit' },
    ];
  }

  const [currentStep, setCurrentStep] = useState(1);
  const currentStepRef = React.useRef(1);
  
  // Sync ref with state
  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);
  
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: '',
    mobileNumber: '',
    email: '',
    pincode: '',
    dob: '',
    city: '',
    panCard: '',
    // Employment Info
    employmentType: loanType === 'business' ? 'self-employed' : 'salaried',
    monthlyIncome: '',
    employerName: '',
    existingEmi: '',
    // Business Details
    businessType: '',
    turnover: '',
    yearsInBusiness: '',
    gstRegistered: 'yes',
    // Property Details (Home Loan & LAP)
    propertyCost: '', // Also used for Market Value in LAP
    propertyLoanType: '', 
    propertyCity: '',
    propertyStatus: '',
    // LAP Specific
    propertyType: '', // Residential, Commercial, Industrial
    occupancyStatus: '', // Self Occupied, Rented
    // Car Loan Specific
    carType: '', // New or Used
    carMake: '', // Manufacturer
    carModel: '',
    carVariant: '',
    carPrice: '', // On-Road Price
    carYear: '', // For used cars
    downPayment: '',
    // Education Loan Specific
    courseName: '',
    instituteName: '',
    courseCountry: '',
    courseDuration: '',
    courseFee: '',
    // Loan Requirement
    loanAmount: '',
    tenure: '',
    loanPurpose: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Validation function to check if current step is valid
  const isCurrentStepValid = () => {
    // Step 1: Personal Details / Basic Details
    if (currentStep === 1) {
      return !!(
        formData.fullName?.trim() &&
        formData.mobileNumber?.trim() &&
        formData.mobileNumber.length === 10 &&
        formData.email?.trim() &&
        formData.email.includes('@') &&
        formData.pincode?.trim() &&
        formData.pincode.length === 6 &&
        formData.dob?.trim() &&
        formData.city?.trim() &&
        formData.panCard?.trim() &&
        formData.panCard.length === 10
      );
    }

    // Step 2: Employment Info
    if (currentStep === 2) {
      const existingEmiValue = formData.existingEmi?.trim();
      return !!(
        formData.employmentType?.trim() &&
        formData.monthlyIncome?.trim() &&
        parseFloat(formData.monthlyIncome) > 0 &&
        formData.employerName?.trim() &&
        existingEmiValue !== undefined &&
        existingEmiValue !== '' &&
        !isNaN(parseFloat(existingEmiValue)) &&
        parseFloat(existingEmiValue) >= 0
      );
    }

    // Step 3: Business Details (Business Loan only)
    if (currentStep === 3 && isBusinessLoan) {
      return !!(
        formData.businessType?.trim() &&
        formData.turnover?.trim() &&
        parseFloat(formData.turnover) > 0 &&
        formData.yearsInBusiness?.trim() &&
        parseInt(formData.yearsInBusiness) > 0 &&
        formData.gstRegistered?.trim()
      );
    }

    // Step 3: Property Details (Home Loan only)
    if (currentStep === 3 && isHomeLoan) {
      return !!(
        formData.propertyCost?.trim() &&
        parseFloat(formData.propertyCost) > 0 &&
        formData.propertyLoanType?.trim() &&
        formData.propertyCity?.trim() &&
        formData.propertyStatus?.trim()
      );
    }

    // Step 3: Property Info (LAP only)
    if (currentStep === 3 && isLAP) {
      return !!(
        formData.propertyType?.trim() &&
        formData.propertyCost?.trim() &&
        parseFloat(formData.propertyCost) > 0 &&
        formData.propertyCity?.trim() &&
        formData.occupancyStatus?.trim() &&
        formData.loanAmount?.trim() &&
        parseFloat(formData.loanAmount) > 0 &&
        formData.tenure?.trim() &&
        parseInt(formData.tenure) > 0 &&
        formData.loanPurpose?.trim()
      );
    }

    // Step 3: Vehicle Details (Car Loan only)
    if (currentStep === 3 && isCarLoan) {
      const baseValidation = !!(
        formData.carType?.trim() &&
        formData.carMake?.trim() &&
        formData.carModel?.trim() &&
        formData.carVariant?.trim() &&
        formData.carPrice?.trim() &&
        parseFloat(formData.carPrice) > 0 &&
        formData.downPayment?.trim() &&
        parseFloat(formData.downPayment) > 0
      );
      
      // For used cars, also validate year
      if (formData.carType === 'used') {
        return baseValidation && !!(
          formData.carYear?.trim() &&
          parseInt(formData.carYear) >= 2018 &&
          parseInt(formData.carYear) <= new Date().getFullYear()
        );
      }
      
      return baseValidation;
    }

    // Step 3: Education Details (Education Loan only)
    if (currentStep === 3 && isEducationLoan) {
      return !!(
        formData.courseName?.trim() &&
        formData.instituteName?.trim() &&
        formData.courseCountry?.trim() &&
        formData.courseDuration?.trim() &&
        parseInt(formData.courseDuration) > 0 &&
        formData.courseFee?.trim() &&
        parseFloat(formData.courseFee) > 0
      );
    }

    // Step 3/4: Loan Requirement
    // Loan requirement step: Business loan step 4, or Personal loan step 3
    if ((isBusinessLoan && currentStep === 4) || (!isBusinessLoan && !isHomeLoan && !isLAP && !isCarLoan && !isEducationLoan && currentStep === 3)) {
      return !!(
        formData.loanAmount?.trim() &&
        parseFloat(formData.loanAmount) > 0 &&
        formData.tenure?.trim() &&
        parseInt(formData.tenure) > 0 &&
        formData.loanPurpose?.trim()
      );
    }

    return true;
  };

  const handleNext = async () => {
    // Validate current step before proceeding
    if (!isCurrentStepValid()) {
      return; // Don't proceed if validation fails
    }

    // If on last step, submit the form
    if (currentStep === steps.length) {
      await handleSubmit();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleClose = () => {
    router.push('/');
  };

  const prepareApplicationData = () => {
    const applicationData: any = {
      loanType,
      personalInfo: {
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        pincode: formData.pincode,
        dob: formData.dob,
        city: formData.city,
        panCard: formData.panCard.toUpperCase(),
      },
      employmentInfo: {
        employmentType: formData.employmentType,
        monthlyIncome: parseFloat(formData.monthlyIncome),
        employerName: formData.employerName,
        existingEmi: parseFloat(formData.existingEmi) || 0,
      },
      loanRequirement: {
        loanAmount: parseFloat(formData.loanAmount),
        tenure: parseInt(formData.tenure),
        loanPurpose: formData.loanPurpose,
      },
    };

    // Add business details if business loan
    if (isBusinessLoan) {
      applicationData.businessDetails = {
        businessType: formData.businessType,
        turnover: parseFloat(formData.turnover),
        yearsInBusiness: parseInt(formData.yearsInBusiness),
        gstRegistered: formData.gstRegistered === 'yes',
      };
    }

    // Add property details if home loan or LAP
    if (isHomeLoan) {
      applicationData.propertyDetails = {
        propertyCost: parseFloat(formData.propertyCost),
        propertyLoanType: formData.propertyLoanType,
        propertyCity: formData.propertyCity,
        propertyStatus: formData.propertyStatus,
      };
    }

    if (isLAP) {
      applicationData.propertyDetails = {
        currentMarketValue: parseFloat(formData.propertyCost),
        propertyType: formData.propertyType,
        propertyCity: formData.propertyCity,
        occupancyStatus: formData.occupancyStatus,
      };
    }

    return applicationData;
  };

  const submitApplicationData = async (applicationData: any) => {
    if (isSubmittingRef.current) return; // Prevent duplicate submissions
    
    setIsSubmitting(true);
    setSubmitError('');
    isSubmittingRef.current = true;

    try {
      // Submit to backend API
      const response = await fetch('/api/applications/loan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      });

      const result = await response.json();

      if (result.success) {
        // Show success popup and redirect to home page after delay
        setApplicationId(result.applicationId);
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
          router.push('/');
        }, 4000);
      } else {
        setSubmitError(result.errors?.join(', ') || result.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  const handleSubmit = async () => {
    // Prepare and submit the application data directly
    const applicationData = prepareApplicationData();
    await submitApplicationData(applicationData);
  };

  // Determine which step is active
  const showPersonalDetails = currentStep === 1;
  const showEmploymentInfo = currentStep === 2;
  const showBusinessDetails = isBusinessLoan && currentStep === 3;
  const showPropertyDetails = isHomeLoan && currentStep === 3;
  const showLAPDetails = isLAP && currentStep === 3;
  const showCarDetails = isCarLoan && currentStep === 3;
  const showLoanRequirement = (isBusinessLoan && currentStep === 4) || (!isBusinessLoan && !isHomeLoan && !isLAP && !isCarLoan && currentStep === 3);
  const showReview = (isBusinessLoan && currentStep === 5) || ((isHomeLoan || isLAP || isCarLoan) && currentStep === 4) || (!isBusinessLoan && !isHomeLoan && !isLAP && !isCarLoan && currentStep === 4);

  // Dynamic Title
  const getTitle = () => {
    if (isBusinessLoan) return 'Business Loan Application';
    if (isHomeLoan) return 'Home Loan Application';
    if (isLAP) return 'Loan Against Property';
    if (isEducationLoan) return 'Education Loan Application';
    if (isCarLoan) return 'Car Loan Application';
    return 'Personal Loan Application';
  };

  return (
    <>
      <div className="bg-white w-full rounded-t-[2rem] md:rounded-3xl shadow-2xl overflow-hidden h-[90vh] md:h-auto md:max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-10 duration-500">
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-800 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

      {/* Header Section */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-4 md:px-8">
         <div className="max-w-4xl mx-auto text-center mb-4">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              {getTitle()}
            </h1>
         </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between max-w-3xl mx-auto relative">
          {steps.map((step) => (
            <div key={step.id} className={`flex flex-col items-center relative z-10 ${isBusinessLoan ? 'w-1/5' : 'w-1/4'}`}>
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-sm
                  ${step.id <= currentStep 
                    ? 'bg-blue-900 text-white scale-110 ring-2 ring-white' 
                    : 'bg-white border-2 border-gray-200 text-gray-400'}`}
              >
                {step.id < currentStep ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <span className={`text-[9px] md:text-[10px] mt-2 font-semibold text-center tracking-wide uppercase w-full
                ${step.id <= currentStep ? 'text-blue-900' : 'text-gray-400'}`}>
                {step.title}
              </span>
            </div>
          ))}
          {/* Progress Line */}
          <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 -z-0">
             <div 
               className="h-full bg-blue-900 transition-all duration-500"
               style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
             />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-white">
        
        {/* Step 1: Personal Details */}
        {showPersonalDetails && (
          <div className="space-y-5 max-w-4xl mx-auto pb-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{isBusinessLoan || isHomeLoan || isLAP ? 'Basic Details' : 'Personal Details'}</h3>
                <p className="text-gray-500 text-sm mt-1">Please provide your basic personal information</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Full Name (as per ID) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                  placeholder="Your Full Name" 
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Mobile Number (10 digits) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="tel" 
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  maxLength={10}
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                  placeholder="Your 10-digit Mobile Number" 
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                  placeholder="Your Email Address" 
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Current Pincode <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  maxLength={6}
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                  placeholder="6-digit Pincode" 
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input 
                  type="date" 
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-900 font-medium" 
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  City of Residence <span className="text-red-500">*</span>
                </label>
                <select 
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white font-medium"
                >
                  <option value="">Select your city</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Pune">Pune</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700">
                  PAN Card Number <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="panCard"
                  value={formData.panCard}
                  onChange={handleInputChange}
                  maxLength={10}
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 uppercase font-medium tracking-wide" 
                  placeholder="Your PAN Card Number" 
                />
                <p className="text-xs text-gray-500 mt-1">We need this to check your credit score for better rates</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Employment Info */}
        {showEmploymentInfo && (
          <div className="space-y-5 max-w-4xl mx-auto pb-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Employment Info</h3>
                <p className="text-gray-500 text-sm mt-1">Tell us about your work to check eligibility</p>
              </div>
            </div>

              <div className="space-y-6">
              {/* Employment Type Selection */}
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                <label className="block text-sm font-bold text-gray-900 mb-4">
                  Select Your Employment Status <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 gap-4">
                   {/* Show Salaried option only if NOT business loan */}
                   {!isBusinessLoan && (
                     <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all
                       ${formData.employmentType === 'salaried' 
                         ? 'border-blue-600 bg-white shadow-sm' 
                         : 'border-transparent bg-white/50 hover:bg-white'}`}>
                       <input 
                         type="radio" 
                         name="employmentType" 
                         value="salaried"
                         checked={formData.employmentType === 'salaried'}
                         onChange={handleInputChange}
                         className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                       />
                       <div className="ml-4">
                         <span className="block text-base font-bold text-gray-900">Salaried Employee</span>
                         <span className="text-sm text-gray-500">I receive a fixed monthly salary</span>
                       </div>
                     </label>
                   )}

                   {/* Show Self-Employed option only if NOT personal loan */}
                   {!isPersonalLoan && (
                     <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all
                       ${formData.employmentType === 'self-employed' 
                         ? 'border-blue-600 bg-white shadow-sm' 
                         : 'border-transparent bg-white/50 hover:bg-white'}`}>
                       <input 
                         type="radio" 
                         name="employmentType" 
                         value="self-employed"
                         checked={formData.employmentType === 'self-employed'}
                         onChange={handleInputChange}
                         className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                       />
                       <div className="ml-4">
                         <span className="block text-base font-bold text-gray-900">Self-Employed</span>
                         <span className="text-sm text-gray-500">Business Owner, Professional, Freelancer</span>
                       </div>
                     </label>
                   )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="block text-sm font-semibold text-gray-700">
                     Monthly Net Income (₹) <span className="text-red-500">*</span>
                   </label>
                   <div className="relative">
                     <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                     <input 
                       type="number" 
                       name="monthlyIncome"
                       value={formData.monthlyIncome}
                       onChange={handleInputChange}
                       className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                       placeholder="Your Monthly Income (Min. 15000)" 
                     />
                   </div>
                 </div>

                 <div className="space-y-2">
                   <label className="block text-sm font-semibold text-gray-700">
                     Employer Name / Business Name <span className="text-red-500">*</span>
                   </label>
                   <div className="relative">
                     <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                     <input 
                       type="text" 
                       name="employerName"
                       value={formData.employerName}
                       onChange={handleInputChange}
                       className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                       placeholder="Company or Business Name" 
                     />
                   </div>
                 </div>

                 <div className="space-y-2 md:col-span-2">
                   <label className="block text-sm font-semibold text-gray-700">
                     Total Existing Monthly EMI (₹) <span className="text-red-500">*</span>
                   </label>
                   <div className="relative">
                     <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                     <input 
                       type="number" 
                       name="existingEmi"
                       value={formData.existingEmi}
                       onChange={handleInputChange}
                       className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                       placeholder="Enter 0 if no existing EMI" 
                     />
                   </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 (Business Only): Business Details */}
        {showBusinessDetails && (
          <div className="space-y-5 max-w-4xl mx-auto pb-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Business Details</h3>
                <p className="text-gray-500 text-sm mt-1">Quick approval</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Type of Business/Firm <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Store className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select 
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                  >
                    <option value="">Select Type</option>
                    <option value="proprietorship">Proprietorship</option>
                    <option value="partnership">Partnership</option>
                    <option value="private_ltd">Private Limited</option>
                    <option value="llp">LLP</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Annual Net Turnover (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="number" 
                    name="turnover"
                    value={formData.turnover}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                    placeholder="Annual Business Turnover" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Years in Business <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="number" 
                    name="yearsInBusiness"
                    value={formData.yearsInBusiness}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                    placeholder="Number of Years" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  GST Registered? <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <label className={`flex-1 flex items-center p-3 rounded-xl border cursor-pointer transition-all
                    ${formData.gstRegistered === 'yes' 
                      ? 'border-blue-600 bg-blue-50 text-blue-900' 
                      : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input 
                      type="radio" 
                      name="gstRegistered" 
                      value="yes"
                      checked={formData.gstRegistered === 'yes'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 font-medium">Yes</span>
                  </label>
                  <label className={`flex-1 flex items-center p-3 rounded-xl border cursor-pointer transition-all
                    ${formData.gstRegistered === 'no' 
                      ? 'border-blue-600 bg-blue-50 text-blue-900' 
                      : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input 
                      type="radio" 
                      name="gstRegistered" 
                      value="no"
                      checked={formData.gstRegistered === 'no'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 font-medium">No</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 (Home Loan Only): Property Details */}
        {showPropertyDetails && (
          <div className="space-y-5 max-w-4xl mx-auto pb-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Property Details</h3>
                <p className="text-gray-500 text-sm mt-1">Low interest rates</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Estimated Property Cost (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Home className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="number" 
                    name="propertyCost"
                    value={formData.propertyCost}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                    placeholder="Estimated Property Value" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Loan Type <span className="text-red-500">*</span>
                </label>
                <select 
                  name="propertyLoanType"
                  value={formData.propertyLoanType}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                >
                  <option value="">Select type</option>
                  <option value="new_purchase">New Purchase</option>
                  <option value="resale">Resale Property</option>
                  <option value="construction">Construction</option>
                  <option value="plot">Plot Purchase</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Property City <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="propertyCity"
                  value={formData.propertyCity}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                  placeholder="Property Location City" 
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Property Status <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 gap-3">
                  <label className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all
                    ${formData.propertyStatus === 'ready' 
                      ? 'border-blue-600 bg-blue-50 text-blue-900' 
                      : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input 
                      type="radio" 
                      name="propertyStatus" 
                      value="ready"
                      checked={formData.propertyStatus === 'ready'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 font-medium">Ready to Move</span>
                  </label>
                  <label className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all
                    ${formData.propertyStatus === 'construction' 
                      ? 'border-blue-600 bg-blue-50 text-blue-900' 
                      : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input 
                      type="radio" 
                      name="propertyStatus" 
                      value="construction"
                      checked={formData.propertyStatus === 'construction'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 font-medium">Under Construction</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3 (LAP Only): Property Info */}
        {showLAPDetails && (
          <div className="space-y-5 max-w-4xl mx-auto pb-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Property Info</h3>
                <p className="text-gray-500 text-sm mt-1">Unlock value from your property</p>
              </div>
              <span className="hidden md:inline-block text-sm font-bold text-green-700 bg-green-50 px-4 py-2 rounded-full border border-green-200 shadow-sm">
                Low Interest Rates
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Type of Property <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select 
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                  >
                    <option value="">Select Type</option>
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="industrial">Industrial</option>
                    <option value="plot">Plot / Land</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Current Market Value (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="number" 
                    name="propertyCost"
                    value={formData.propertyCost}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                    placeholder="E.g., 15000000" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Property City <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="propertyCity"
                  value={formData.propertyCity}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                  placeholder="Property Location City" 
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Property Usage/Status <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 gap-3">
                  <label className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all
                    ${formData.occupancyStatus === 'self' 
                      ? 'border-blue-600 bg-blue-50 text-blue-900' 
                      : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input 
                      type="radio" 
                      name="occupancyStatus" 
                      value="self"
                      checked={formData.occupancyStatus === 'self'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 font-medium">Self Occupied</span>
                  </label>
                  <label className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all
                    ${formData.occupancyStatus === 'rented' 
                      ? 'border-blue-600 bg-blue-50 text-blue-900' 
                      : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input 
                      type="radio" 
                      name="occupancyStatus" 
                      value="rented"
                      checked={formData.occupancyStatus === 'rented'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 font-medium">Rented Out</span>
                  </label>
                  <label className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all
                    ${formData.occupancyStatus === 'vacant' 
                      ? 'border-blue-600 bg-blue-50 text-blue-900' 
                      : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input 
                      type="radio" 
                      name="occupancyStatus" 
                      value="vacant"
                      checked={formData.occupancyStatus === 'vacant'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="ml-3 font-medium">Vacant</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Loan Requirement Section */}
            <div className="border-t border-gray-100 pt-6 mt-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Loan Requirement</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Required Loan Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                      type="number" 
                      name="loanAmount"
                      value={formData.loanAmount}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                      placeholder="E.g., 5000000" 
                    />
                  </div>
                  <p className="text-xs text-gray-500">Up to 70% of property value</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Desired Tenure (Years) <span className="text-red-500">*</span>
                  </label>
                  <select 
                    name="tenure"
                    value={formData.tenure}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                  >
                    <option value="">Select tenure</option>
                    <option value="1">1 Year</option>
                    <option value="2">2 Years</option>
                    <option value="3">3 Years</option>
                    <option value="5">5 Years</option>
                    <option value="7">7 Years</option>
                    <option value="10">10 Years</option>
                    <option value="15">15 Years</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Purpose of Loan <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="loanPurpose"
                    value={formData.loanPurpose}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                    placeholder="E.g., Business expansion, Working capital, Medical emergency" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Vehicle Details (Car Loan) */}
        {showCarDetails && (
          <div className="space-y-5 max-w-4xl mx-auto pb-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Vehicle Details</h3>
                <p className="text-gray-500 text-sm mt-1">Tell us about your dream car</p>
              </div>
              <span className="hidden md:inline-block text-sm font-bold text-teal-700 bg-teal-50 px-4 py-2 rounded-full border border-teal-200 shadow-sm">
                Drive Home Today
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Car Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Car className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select 
                    name="carType"
                    value={formData.carType}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                  >
                    <option value="">Select Type</option>
                    <option value="new">New Car</option>
                    <option value="used">Used Car (Up to 7 years old)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Car Make/Manufacturer <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="text" 
                    name="carMake"
                    value={formData.carMake}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                    placeholder="E.g., Maruti, Hyundai, Tata" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Car Model <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Car className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="text" 
                    name="carModel"
                    value={formData.carModel}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                    placeholder="E.g., Swift, Creta, Nexon" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Variant <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="text" 
                    name="carVariant"
                    value={formData.carVariant}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                    placeholder="E.g., VXi, SX, XZ+" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  On-Road Price (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="number" 
                    name="carPrice"
                    value={formData.carPrice}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                    placeholder="E.g., 800000" 
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Including all taxes and charges</p>
              </div>

              {formData.carType === 'used' && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Manufacturing Year <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                      type="number" 
                      name="carYear"
                      value={formData.carYear}
                      onChange={handleInputChange}
                      min="2018"
                      max={new Date().getFullYear()}
                      className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                      placeholder={`E.g., ${new Date().getFullYear() - 2}`}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Down Payment (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="number" 
                    name="downPayment"
                    value={formData.downPayment}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                    placeholder="E.g., 80000" 
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 10% of car price</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Education Details (Education Loan) */}
        {isEducationLoan && currentStep === 3 && (
          <div className="space-y-5 max-w-4xl mx-auto pb-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Education Details</h3>
                <p className="text-gray-500 text-sm mt-1">Tell us about your educational plans</p>
              </div>
              <span className="hidden md:inline-block text-sm font-bold text-indigo-700 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-200 shadow-sm">
                Invest in Your Future
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Course Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="text" 
                    name="courseName"
                    value={formData.courseName}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                    placeholder="E.g., MBA, B.Tech, MS" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Institute Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="text" 
                    name="instituteName"
                    value={formData.instituteName}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                    placeholder="University/College Name" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Country <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Home className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select 
                    name="courseCountry"
                    value={formData.courseCountry}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                  >
                    <option value="">Select Country</option>
                    <option value="india">India</option>
                    <option value="usa">USA</option>
                    <option value="uk">UK</option>
                    <option value="canada">Canada</option>
                    <option value="australia">Australia</option>
                    <option value="germany">Germany</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Course Duration (Years) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="number" 
                    name="courseDuration"
                    value={formData.courseDuration}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                    placeholder="E.g., 2, 3, 4" 
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Total Course Fee (₹) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="number" 
                    name="courseFee"
                    value={formData.courseFee}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                    placeholder="E.g., 1500000" 
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Total tuition and other educational expenses</p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3/4: Loan Requirement */}
        {showLoanRequirement && (
          <div className="space-y-5 max-w-4xl mx-auto pb-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Loan Requirement</h3>
                <p className="text-gray-500 text-sm mt-1">Tell us about your loan needs</p>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-blue-800 text-sm font-medium">
              Specify the funds you need and the timeline for repayment.
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Required Loan Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400 font-medium" 
                  placeholder="Required Loan Amount" 
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Desired Tenure (Years) <span className="text-red-500">*</span>
                </label>
                <select 
                  name="tenure"
                  value={formData.tenure}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                >
                  <option value="">Select tenure</option>
                  <option value="1">1 Year</option>
                  <option value="2">2 Years</option>
                  <option value="3">3 Years</option>
                  <option value="4">4 Years</option>
                  <option value="5">5 Years</option>
                  <option value="7">7 Years</option>
                  <option value="10">10 Years</option>
                  <option value="15">15 Years</option>
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Purpose of Loan <span className="text-red-500">*</span>
                </label>
                <select 
                  name="loanPurpose"
                  value={formData.loanPurpose}
                  onChange={handleInputChange}
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium"
                >
                  <option value="">Select purpose</option>
                  <option value="personal">Personal Use</option>
                  <option value="medical">Medical Emergency</option>
                  <option value="wedding">Wedding / Event</option>
                  <option value="business">Business Expansion</option>
                  <option value="working_capital">Working Capital</option>
                  <option value="equipment">Equipment Purchase</option>
                  <option value="debt_consolidation">Debt Consolidation</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4/5: Review & Submit */}
        {showReview && (
          <div className="space-y-6 max-w-4xl mx-auto pb-20">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce mb-4">
                <ShieldCheck className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Review Your Application</h3>
              <p className="text-gray-500">Please verify your details before final submission</p>
            </div>

            {/* Personal Details Review */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="bg-gray-50 px-4 md:px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                <h4 className="font-bold text-gray-900 text-sm md:text-base">{isBusinessLoan || isHomeLoan || isLAP ? 'Basic Details' : 'Personal Details'}</h4>
                <button onClick={() => setCurrentStep(1)} className="text-blue-600 text-xs md:text-sm font-medium hover:underline">Edit</button>
              </div>
              <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <ReviewField label="Full Name" value={formData.fullName} />
                <ReviewField label="Mobile Number" value={formData.mobileNumber} />
                <ReviewField label="Email Address" value={formData.email} />
                <ReviewField label="Pincode" value={formData.pincode} />
                <ReviewField label="Date of Birth" value={formData.dob} />
                <ReviewField label="City" value={formData.city} />
                <ReviewField label="PAN Card" value={formData.panCard} />
              </div>
            </div>

            {/* Employment Info Review */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                <h4 className="font-bold text-gray-900">Employment Info</h4>
                <button onClick={() => setCurrentStep(2)} className="text-blue-600 text-sm font-medium hover:underline">Edit</button>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <ReviewField label="Employment Type" value={formData.employmentType} className="capitalize" />
                <ReviewField label="Monthly Income" value={`₹${formData.monthlyIncome || '0'}`} />
                <ReviewField label="Employer Name" value={formData.employerName} />
                <ReviewField label="Existing EMI" value={`₹${formData.existingEmi || '0'}`} />
              </div>
            </div>

            {/* Business Details Review (Business Loan Only) */}
            {isBusinessLoan && (
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h4 className="font-bold text-gray-900">Business Details</h4>
                  <button onClick={() => setCurrentStep(3)} className="text-blue-600 text-sm font-medium hover:underline">Edit</button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <ReviewField label="Business Type" value={formData.businessType} className="capitalize" />
                  <ReviewField label="Annual Turnover" value={`₹${formData.turnover || '0'}`} />
                  <ReviewField label="Years in Business" value={formData.yearsInBusiness} />
                  <ReviewField label="GST Registered" value={formData.gstRegistered} className="capitalize" />
                </div>
              </div>
            )}

            {/* Property Details Review (Home Loan Only) */}
            {isHomeLoan && (
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h4 className="font-bold text-gray-900">Property Details</h4>
                  <button onClick={() => setCurrentStep(3)} className="text-blue-600 text-sm font-medium hover:underline">Edit</button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <ReviewField label="Estimated Cost" value={`₹${formData.propertyCost || '0'}`} />
                  <ReviewField label="Loan Type" value={formData.propertyLoanType} className="capitalize" />
                  <ReviewField label="Property City" value={formData.propertyCity} />
                  <ReviewField label="Property Status" value={formData.propertyStatus} className="capitalize" />
                </div>
              </div>
            )}

            {/* LAP Details Review (LAP Only) */}
            {isLAP && (
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h4 className="font-bold text-gray-900">Property Info</h4>
                  <button onClick={() => setCurrentStep(3)} className="text-blue-600 text-sm font-medium hover:underline">Edit</button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <ReviewField label="Property Type" value={formData.propertyType} className="capitalize" />
                  <ReviewField label="Market Value" value={`₹${formData.propertyCost || '0'}`} />
                  <ReviewField label="City" value={formData.propertyCity} />
                  <ReviewField label="Occupancy Status" value={formData.occupancyStatus} className="capitalize" />
                </div>
              </div>
            )}

            {/* Loan Requirement Review */}
            {(!isHomeLoan) && (
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
                  <h4 className="font-bold text-gray-900">Loan Requirement</h4>
                  <button onClick={() => setCurrentStep(isBusinessLoan ? 4 : (isLAP || isCarLoan || isEducationLoan) ? 4 : 3)} className="text-blue-600 text-sm font-medium hover:underline">Edit</button>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <ReviewField label="Required Loan Amount" value={`₹${formData.loanAmount || '0'}`} />
                  <ReviewField label="Desired Tenure" value={formData.tenure ? `${formData.tenure} Years` : '-'} />
                  <ReviewField label="Purpose of Loan" value={formData.loanPurpose} className="capitalize" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions - Sticky Bottom */}
      <div className="border-t border-gray-100 bg-white p-3 md:p-4 z-20">
        {submitError && (
          <div className="max-w-4xl mx-auto mb-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            <strong>Error:</strong> {submitError}
          </div>
        )}
        <div className="flex justify-between max-w-4xl mx-auto">
          <button 
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center px-6 py-2.5 rounded-lg font-bold transition-all text-sm
              ${currentStep === 1 
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-600 hover:text-blue-900 hover:bg-gray-100'}`}
          >
            <ChevronLeft className="h-4 w-4 mr-1.5" />
            Back
          </button>

          <button 
            onClick={handleNext}
            disabled={isSubmitting || !isCurrentStepValid()}
            className={`flex items-center bg-blue-900 text-white px-8 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 ${(isSubmitting || !isCurrentStepValid()) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Submitting...' : currentStep === steps.length ? 'Submit Application' : 'Next Step'}
            {currentStep !== steps.length && !isSubmitting && <ChevronRight className="h-4 w-4 ml-1.5" />}
          </button>
        </div>
      </div>
    </div>

    {/* Success Popup */}
    {showSuccessPopup && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 animate-in zoom-in-95 duration-300">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-4 w-full">
              <p className="text-sm text-gray-600 mb-1">Your Reference ID:</p>
              <p className="text-lg font-bold text-blue-600">{applicationId}</p>
            </div>
            <p className="text-gray-600 mb-6">Our team will contact you shortly with updates.</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div className="bg-green-600 h-full animate-[shrink_4s_linear]" style={{width: '100%'}}></div>
            </div>
            <p className="text-xs text-gray-400 mt-3">Redirecting to home page...</p>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

const ReviewField = ({ label, value, className = '' }: { label: string, value: string, className?: string }) => (
  <div>
    <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">{label}</p>
    <p className={`text-base font-semibold text-gray-900 ${className}`}>{value || '-'}</p>
  </div>
);

export default ApplicationForm;
