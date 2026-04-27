'use client';
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
export default function ConsultancyPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    employmentType: 'salaried',
    annualIncome: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState('');
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const isFormValid = () => {
    return !!(
      formData.fullName.trim() &&
      /^\d{10}$/.test(formData.mobileNumber.trim()) &&
      (formData.employmentType === 'salaried' || formData.employmentType === 'self-employed') &&
      Number(formData.annualIncome) > 0
    );
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      setError('Please enter valid details in all fields.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/consultancy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          phoneNumber: formData.mobileNumber.trim(),
          interestedIn: formData.employmentType,
          message: `Annual Income: ${formData.annualIncome}`,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setShowSuccessModal(true);
        setFormData({
          fullName: '',
          mobileNumber: '',
          employmentType: 'salaried',
          annualIncome: '',
        });
      } else {
        setError(result.errors?.join(', ') || result.error || 'Failed to submit request');
      }
    } catch (submitError) {
      console.error('Consultancy submit error:', submitError);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-teal-50/20 to-white pt-20">
      <Navbar />
      <div className="relative bg-gradient-to-br from-teal-700 via-teal-800 to-indigo-900 text-white py-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(45,212,191,0.15),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
            Get Expert Financial Advice, <span className="text-amber-300">Absolutely Free.</span>
          </h1>
          <p className="text-teal-100 max-w-2xl mx-auto text-lg">
            Our team of financial experts is here to guide you through your loan journey.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 -mt-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          <div className="flex flex-col">
            <div className="relative bg-white rounded-2xl shadow-lg border border-slate-100 p-8 flex-1 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-amber-500" />
              <h3 className="text-xl font-bold text-slate-800 mb-8">Why Consult with Us?</h3>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-base mb-1">Unbiased Recommendations</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">We compare offers from 20+ partner banks to find the best fit for your profile.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-base mb-1">Higher Approval Chances</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">We match your profile with the right lender criteria to minimize rejection risk.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-base mb-1">Fast Track Processing</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">Dedicated relationship managers ensure your application moves quickly.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="bg-white rounded-2xl shadow-xl border border-teal-100 p-6 md:p-8 flex-1">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Request Free Consultancy</h3>
              {showSuccessModal ? (
                <div className="text-center py-10 bg-teal-50 rounded-xl border border-teal-100 px-6">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-teal-600" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800 mb-2">Request Received!</h4>
                  <p className="text-slate-600">Thank you for reaching out. Our financial expert will call you shortly.</p>
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="mt-6 px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Send Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Customer Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Your Full Name"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Mobile No <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Employment Type <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${formData.employmentType === 'salaried' ? 'border-teal-600 bg-teal-50 text-teal-900' : 'border-gray-200'}`}>
                        <input
                          type="radio"
                          name="employmentType"
                          value="salaried"
                          checked={formData.employmentType === 'salaried'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-teal-600"
                        />
                        <span className="ml-3 font-medium">Salaried</span>
                      </label>
                      <label className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${formData.employmentType === 'self-employed' ? 'border-teal-600 bg-teal-50 text-teal-900' : 'border-gray-200'}`}>
                        <input
                          type="radio"
                          name="employmentType"
                          value="self-employed"
                          checked={formData.employmentType === 'self-employed'}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-teal-600"
                        />
                        <span className="ml-3 font-medium">Self-Employed</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700">Annual Income (?) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      name="annualIncome"
                      value={formData.annualIncome}
                      onChange={handleInputChange}
                      placeholder="e.g. 500000"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || !isFormValid()}
                    className="w-full py-4 px-6 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-lg shadow-teal-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  >
                    {isSubmitting ? 'Submitting...' : 'Request Callback'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}