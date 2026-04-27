'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, User, Phone, IndianRupee, CheckCircle } from 'lucide-react';
interface ApplicationFormProps {
  loanType?: string;
}
const ApplicationForm = ({ loanType = 'personal' }: ApplicationFormProps) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    employmentType: 'salaried',
    annualIncome: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const isFormValid = () => {
    const annualIncome = Number(formData.annualIncome);
    return !!(
      formData.fullName.trim() &&
      /^\d{10}$/.test(formData.mobileNumber.trim()) &&
      (formData.employmentType === 'salaried' || formData.employmentType === 'self-employed') &&
      Number.isFinite(annualIncome) &&
      annualIncome > 0
    );
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      setSubmitError('Please enter valid details in all fields.');
      return;
    }
    const annualIncome = Number(formData.annualIncome);
    const monthlyIncome = Math.max(1, Math.round(annualIncome / 12));
    const payload = {
      loanType,
      personalInfo: {
        fullName: formData.fullName.trim(),
        mobileNumber: formData.mobileNumber.trim(),
        email: `lead+${formData.mobileNumber.trim()}@loanbazaar.in`,
        pincode: '400001',
        dob: '1990-01-01',
        city: 'Mumbai',
        panCard: 'ABCDE1234F',
      },
      employmentInfo: {
        employmentType: formData.employmentType,
        monthlyIncome,
        employerName: 'NA',
        existingEmi: 0,
      },
      loanRequirement: {
        loanAmount: Math.max(100000, Math.round(annualIncome * 0.5)),
        tenure: 5,
        loanPurpose: 'General',
      },
    };
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const response = await fetch('/api/applications/loan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => router.push('/'), 2000);
      } else {
        setSubmitError(result.errors?.join(', ') || result.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Loan form submit error:', error);
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="bg-white w-full rounded-t-[2rem] md:rounded-3xl shadow-2xl overflow-hidden h-[90vh] md:h-auto md:max-h-[90vh] flex flex-col">
      <button
        onClick={() => router.push('/')}
        className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 z-20"
      >
        <X className="w-5 h-5" />
      </button>
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-4 md:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 capitalize">{loanType} Application</h1>
          <p className="text-gray-500 text-sm mt-1">Only basic lead details required</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-white">
        <div className="max-w-2xl mx-auto">
          {showSuccess ? (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <p className="text-gray-800 font-semibold">Application submitted successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {submitError}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile No <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    maxLength={10}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Employment Type <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center p-3 rounded-xl border cursor-pointer ${formData.employmentType === 'salaried' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                    <input
                      type="radio"
                      name="employmentType"
                      value="salaried"
                      checked={formData.employmentType === 'salaried'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 text-sm font-medium">Salaried</span>
                  </label>
                  <label className={`flex items-center p-3 rounded-xl border cursor-pointer ${formData.employmentType === 'self-employed' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                    <input
                      type="radio"
                      name="employmentType"
                      value="self-employed"
                      checked={formData.employmentType === 'self-employed'}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 text-sm font-medium">Self-Employed</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Income <span className="text-red-500">*</span></label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    name="annualIncome"
                    value={formData.annualIncome}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g. 600000"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid()}
                className="w-full py-3.5 rounded-xl bg-blue-900 text-white font-semibold disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
export default ApplicationForm;