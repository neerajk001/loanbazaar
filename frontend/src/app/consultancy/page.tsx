'use client';
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CheckCircle2, Clock, ShieldCheck, X, CheckCircle } from 'lucide-react';

export default function ConsultancyPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    interestedIn: '',
    message: '',
    authorized: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.fullName.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!formData.phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    const phoneDigits = formData.phoneNumber.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!formData.interestedIn) {
      setError('Please select what you are interested in');
      return;
    }

    if (!formData.authorized) {
      setError('Please authorize us to contact you');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/consultancy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          phoneNumber: phoneDigits,
          email: formData.email.trim() || undefined,
          interestedIn: formData.interestedIn,
          message: formData.message.trim() || undefined,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setShowSuccessModal(true);
        // Reset form
        setFormData({
          fullName: '',
          phoneNumber: '',
          email: '',
          interestedIn: '',
          message: '',
          authorized: true,
        });
      } else {
        setError(result.errors?.join(', ') || result.error || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Error submitting consultancy request:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-teal-50/20 to-white pt-20">
      <Navbar />
      
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-teal-700 via-teal-800 to-indigo-900 text-white py-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(45,212,191,0.15),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight">
            Get Expert Financial Advice, <span className="text-amber-300">Absolutely Free.</span>
          </h1>
          <p className="text-teal-100 max-w-2xl mx-auto text-lg">
            Our team of financial experts is here to guide you through your loan journey. Request a callback for personalized consultancy.
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 -mt-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Content - Why Consult */}
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

          {/* Right Form */}
          <div className="flex flex-col">
            <div className="bg-white rounded-2xl shadow-xl border border-teal-100 p-6 md:p-8 flex-1">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Request Free Consultancy</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                
                <div>
                  <label htmlFor="fullName" className="block text-xs font-medium text-gray-700 mb-0.5">Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    required
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label htmlFor="phoneNumber" className="block text-xs font-medium text-gray-700 mb-0.5">Phone Number <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    required
                    maxLength={10}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                  />
                </div>

                <div>
                    <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-0.5">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                    />
                </div>
                
                <div>
                  <label htmlFor="interestedIn" className="block text-xs font-medium text-gray-700 mb-0.5">Interested In <span className="text-red-500">*</span></label>
                  <select
                    id="interestedIn"
                    name="interestedIn"
                    value={formData.interestedIn}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white"
                  >
                    <option value="">Select an option</option>
                    <option value="Personal Loan">Personal Loan</option>
                    <option value="Home Loan">Home Loan</option>
                    <option value="Business Loan">Business Loan</option>
                    <option value="Loan Against Property">Loan Against Property</option>
                    <option value="Education Loan">Education Loan</option>
                    <option value="Health Insurance">Health Insurance</option>
                    <option value="Term Insurance">Term Insurance</option>
                    <option value="Car Insurance">Car Insurance</option>
                    <option value="Bike Insurance">Bike Insurance</option>
                    <option value="Loan Protector">Loan Protector</option>
                    <option value="EMI Protector">EMI Protector</option>
                    <option value="General Investment Advice">General Investment Advice</option>
                  </select>
                </div>

                <div>
                    <label htmlFor="message" className="block text-xs font-medium text-gray-700 mb-0.5">Message (Optional)</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={2}
                        placeholder="Any specific requirements?"
                        className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all resize-none"
                    ></textarea>
                </div>
                
                <div className="flex items-start gap-2 mt-1">
                  <input
                    id="authorized"
                    name="authorized"
                    type="checkbox"
                    checked={formData.authorized}
                    onChange={handleInputChange}
                    required
                    className="mt-0.5 h-4 w-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                  />
                  <label htmlFor="authorized" className="text-[10px] text-gray-500 leading-tight">
                    I authorize Loanbazaar to contact me via Call/SMS/WhatsApp. <span className="text-red-500">*</span>
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white font-bold py-3.5 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-colors mt-2 shadow-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Get Free Advice'}
                </button>
              </form>
            </div>
          </div>

          {/* Success Modal */}
          {showSuccessModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-in fade-in zoom-in duration-200">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-teal-600" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
                  
                  <p className="text-gray-600 mb-6">
                    We will reach you shortly. Our expert will contact you on your provided phone number.
                  </p>
                  
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>
      
      <Footer />
    </main>
  );
}

