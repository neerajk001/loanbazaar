'use client';
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Phone, Mail, Clock, MapPin, Send, Building2, User, CheckCircle, XCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    message: '',
    loanType: 'Personal Loan'
  });

  const [popup, setPopup] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  const showPopup = (message: string, type: 'success' | 'error') => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
      setPopup({ show: false, message: '', type: 'success' });
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const form = e.target as HTMLFormElement;
    const formDataToSend = new FormData(form);
    
    try {
      const response = await fetch('https://formspree.io/f/mrbnrbrj', {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        showPopup('Message sent successfully!', 'success');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          contactNumber: '',
          message: '',
          loanType: 'Personal Loan'
        });
      } else {
        showPopup('Failed to send message. Please try again.', 'error');
      }
    } catch (error) {
      showPopup('Failed to send message. Please try again.', 'error');
    }
  };

  const loanTypes = [
    'Personal Loan',
    'Business Loan',
    'Home Loan',
    'Loan Against Property',
    'Education Loan'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Popup Notification */}
      {popup.show && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className={`${
            popup.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white px-8 py-6 rounded-2xl shadow-2xl flex items-center gap-3 transform transition-all duration-300 scale-100`}>
            {popup.type === 'success' ? (
              <CheckCircle className="h-6 w-6" />
            ) : (
              <XCircle className="h-6 w-6" />
            )}
            <span className="text-lg font-semibold">{popup.message}</span>
          </div>
        </div>
      )}
      
      {/* Modern Header Section */}
      <div className="relative bg-blue-900  border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-2">
              <Mail className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl md:text-2xl lg:text-3xl font-bold text-white mb-2">
              Get in Touch
            </h1>
            <p className="text-base md:text-lg text-blue-50 max-w-2xl mx-auto">
              Have questions? We're here to help. Reach out to us and let's discuss your financial needs.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Phone Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-100 hover:shadow-md hover:border-blue-300 transition-all">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-600 text-sm mb-2">Mon - Sat</p>
            <p className="text-blue-600 font-semibold">9588833303</p>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-orange-100 hover:shadow-md hover:border-orange-300 transition-all">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-600 text-sm mb-2">Quick response</p>
            <p className="text-orange-600 font-semibold text-sm">info@loansarathi.com</p>
          </div>

          {/* Working Hours Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-blue-100 hover:shadow-md hover:border-blue-300 transition-all">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Working Hours</h3>
            <p className="text-gray-600 text-sm mb-2">Monday - Saturday</p>
            <p className="text-blue-600 font-semibold">10:00 AM – 6:30 PM</p>
          </div>

          {/* Address Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-orange-100 hover:shadow-md hover:border-orange-300 transition-all">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Visit Us</h3>
            <p className="text-gray-600 text-sm">Vasai West, Maharashtra 401202</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Send us a Message</h2>
                <p className="text-gray-600">Fill out the form below and we'll get back to you as soon as possible.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      />
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="john.doe@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="contactNumber"
                      placeholder="+91 98765 43210"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Loan Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="loanType"
                      value={formData.loanType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                    >
                      {loanTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    placeholder="Tell us about your requirements..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white font-bold py-4 px-6 rounded-xl hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Send className="h-5 w-5" />
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            {/* Address Details */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-blue-100 p-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-4">Our Office</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                B-203, 204, 205, Lawrence Trade Center, Manikpur Road, Near Madhuram Hotel, Vasai West 401202
              </p>
              <div className="pt-4 border-t border-blue-100">
                <p className="text-sm text-blue-600 font-medium mb-2">Maharashtra, India</p>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-orange-100 p-2">
              <div className="w-full h-[300px] rounded-xl overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3764.1234567890123!2d72.82345678901234!3d19.456789012345678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDI3JzI0LjQiTiA3MsKwNDknMjQuNCJF!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-gradient-to-br from-orange-50 to-blue-50 rounded-2xl border-2 border-orange-200 p-6">
              <h3 className="font-bold text-gray-900 mb-2">Quick Response</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                We typically respond to all inquiries within 24 hours during business days. For urgent matters.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

