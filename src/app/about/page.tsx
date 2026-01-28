'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, Target, FileSearch, Lightbulb, Network, SearchCheck, UserCheck } from 'lucide-react';

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero/Header */}
      <div className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-3">About Loanbazaar</h1>
          <p className="text-base text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Your trusted financial guide partnering with leading banks and NBFCs to deliver transparent, fast, and reliable loan solutions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        
        {/* Intro & What We Do */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20 lg:mb-24 items-start">
          <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <h2 className="text-3xl font-bold text-blue-900 mb-6">Our Role</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Loanbazaar, powered by <span className="font-semibold text-blue-900">Smart Solutions</span>, acts as your financial guide—helping you choose the best loan options suited to your profile, eligibility, and goals.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We collaborate with India's leading banks and NBFCs to ensure your files are processed efficiently, giving you access to the best interest rates and terms available in the market.
            </p>
          </div>

          <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <FileSearch className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900">What We Do</h3>
            </div>
            <ul className="space-y-4 text-gray-700">
              <li className="flex gap-3">
                <div className="mt-2 w-1.5 h-1.5 bg-orange-500 rounded-full shrink-0" />
                <span>Source and guide customers for Personal, Business, Home Loans, and LAP.</span>
              </li>
              <li className="flex gap-3">
                <div className="mt-2 w-1.5 h-1.5 bg-orange-500 rounded-full shrink-0" />
                <span>Prepare, verify, and submit loan files with complete documentation.</span>
              </li>
              <li className="flex gap-3">
                <div className="mt-2 w-1.5 h-1.5 bg-orange-500 rounded-full shrink-0" />
                <span>Coordinate with institutions for faster approvals and better rates.</span>
              </li>  
              <li className="flex gap-3">
                <div className="mt-2 w-1.5 h-1.5 bg-orange-500 rounded-full shrink-0" />
                <span>Provide end-to-end support from inquiry to disbursement.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <div className="bg-orange-50 rounded-2xl p-8 border border-orange-100 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6">
              <Lightbulb className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Our Vision</h3>
            <p className="text-gray-700 leading-relaxed">
              To become one of India’s most trusted and transparent loan facilitation brands, known for our integrity and customer-centric approach.
            </p>
          </div>

          <div className="bg-green-50 rounded-2xl p-8 border border-green-100 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              Guiding customers through every step of the loan process with honesty, speed, and clarity, ensuring financial empowerment for all.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Why Choose Loanbazaar?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We bring strong market experience and a wide lender network to offer you the best financial solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={<ShieldCheck className="h-6 w-6 text-orange-600" />}
              title="Backed by Smart Solutions"
              description="Leveraging strong market experience for reliable guidance."
            />
            <FeatureCard 
              icon={<Network className="h-6 w-6 text-orange-600" />}
              title="Wide Lender Network"
              description="Access to diverse products from multiple banks and NBFCs."
            />
            <FeatureCard 
              icon={<SearchCheck className="h-6 w-6 text-orange-600" />}
              title="Transparent Processing"
              description="No hidden charges, just clear communication and trust."
            />
            <FeatureCard 
              icon={<UserCheck className="h-6 w-6 text-orange-600" />}
              title="Personalized Solutions"
              description="Offers tailored to your income, profile, and goals."
            />
          </div>
        </div>

      </div>
      <Footer />
    </main>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="group bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-orange-200">
    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-900">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
  </div>
);

export default AboutPage;

