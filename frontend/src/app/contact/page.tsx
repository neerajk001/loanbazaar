'use client';
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Phone, Mail, Clock, MapPin, Send, User, CheckCircle, XCircle } from 'lucide-react';
export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    employmentType: 'salaried',
    annualIncome: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popup, setPopup] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });
  const showPopup = (message: string, type: 'success' | 'error') => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
      setPopup({ show: false, message: '', type: 'success' });
    }, 2000);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
    if (!isFormValid()) return;
    setIsSubmitting(true);
    const payload = new FormData();
    payload.append('Customer Name', formData.fullName);
    payload.append('Mobile No', formData.mobileNumber);
    payload.append('Employment Type', formData.employmentType);
    payload.append('Annual Income', formData.annualIncome);
    try {
      const response = await fetch('https://formspree.io/f/mrbnrbrj', {
        method: 'POST',
        body: payload,
        headers: {
          Accept: 'application/json',
        },
      });
      if (response.ok) {
        showPopup('Message sent successfully!', 'success');
        setFormData({
          fullName: '',
          mobileNumber: '',
          employmentType: 'salaried',
          annualIncome: '',
        });
      } else {
        showPopup('Failed to send message. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Contact form submit error:', error);
      showPopup('Failed to send message. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Navbar />
      {popup.show && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className={`${popup.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white px-8 py-6 rounded-2xl shadow-2xl flex items-center gap-3`}>
            {popup.type === 'success' ? <CheckCircle className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
            <span className="text-lg font-semibold">{popup.message}</span>
          </div>
        </div>
      )}
      <div className="relative bg-blue-900 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-2">
              <Mail className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl md:text-2xl lg:text-3xl font-bold text-white mb-2">Get in Touch</h1>
            <p className="text-base md:text-lg text-blue-50 max-w-2xl mx-auto">Have questions? We're here to help.</p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-100">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4"><Phone className="h-6 w-6 text-white" /></div>
            <h3 className="font-bold text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-600 text-sm mb-2">Mon - Sat</p>
            <p className="text-blue-600 font-semibold">9870802207</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-orange-100">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4"><Mail className="h-6 w-6 text-white" /></div>
            <h3 className="font-bold text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-600 text-sm mb-2">Quick response</p>
            <p className="text-orange-600 font-semibold text-sm">info@ssolutions.in</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-100">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4"><Clock className="h-6 w-6 text-white" /></div>
            <h3 className="font-bold text-gray-900 mb-2">Working Hours</h3>
            <p className="text-gray-600 text-sm mb-2">Monday - Saturday</p>
            <p className="text-blue-600 font-semibold">10:00 AM - 6:30 PM</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-orange-100">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4"><MapPin className="h-6 w-6 text-white" /></div>
            <h3 className="font-bold text-gray-900 mb-2">Visit Us</h3>
            <p className="text-gray-600 text-sm">Dadar East, Mumbai 400014</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                <p className="text-gray-600">Fill out the form below and we'll get back to you as soon as possible.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Customer Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile No <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                      className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Employment Type <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`flex items-center p-3 rounded-xl border cursor-pointer ${formData.employmentType === 'salaried' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                      <input
                        type="radio"
                        name="employmentType"
                        value="salaried"
                        checked={formData.employmentType === 'salaried'}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-3 font-medium">Salaried</span>
                    </label>
                    <label className={`flex items-center p-3 rounded-xl border cursor-pointer ${formData.employmentType === 'self-employed' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'}`}>
                      <input
                        type="radio"
                        name="employmentType"
                        value="self-employed"
                        checked={formData.employmentType === 'self-employed'}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-3 font-medium">Self-Employed</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Income <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    name="annualIncome"
                    value={formData.annualIncome}
                    onChange={handleChange}
                    placeholder="e.g. 600000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !isFormValid()}
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-all w-full disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  <Send className="ml-2 h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}