'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, Target, FileSearch, Lightbulb, Network, SearchCheck, UserCheck } from 'lucide-react';

const AboutPage = () => {
  return (
    <main className="min-h-screen bg-slate-50 pt-20">
      <Navbar />
      
      {/* Hero/Header - Gradient with subtle pattern */}
      <div className="relative bg-gradient-to-br from-teal-700 via-teal-800 to-indigo-900 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(45,212,191,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">About Loanbazaar</h1>
          <p className="text-lg text-teal-100 max-w-2xl mx-auto leading-relaxed">
            Your trusted financial guide partnering with leading banks and NBFCs to deliver transparent, fast, and reliable loan solutions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        
        {/* Intro & What We Do */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20 lg:mb-28 items-start">
          <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-slate-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-amber-500" />
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Our Role</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Loanbazaar, powered by <span className="font-semibold text-teal-600">Smart Solutions</span>, acts as your financial guide—helping you choose the best loan options suited to your profile, eligibility, and goals.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We collaborate with India's leading banks and NBFCs to ensure your files are processed efficiently, giving you access to the best interest rates and terms available in the market.
            </p>
          </div>

          <div className="bg-gradient-to-br from-teal-50 to-indigo-50 rounded-2xl p-8 border border-teal-100/80 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-teal-500 rounded-2xl flex items-center justify-center text-white shadow-md">
                <FileSearch className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">What We Do</h3>
            </div>
            <ul className="space-y-4 text-slate-700">
              <li className="flex gap-3">
                <div className="mt-2 w-2 h-2 bg-amber-500 rounded-full shrink-0" />
                <span>Source and guide customers for Personal, Business, Home Loans, and LAP.</span>
              </li>
              <li className="flex gap-3">
                <div className="mt-2 w-2 h-2 bg-amber-500 rounded-full shrink-0" />
                <span>Prepare, verify, and submit loan files with complete documentation.</span>
              </li>
              <li className="flex gap-3">
                <div className="mt-2 w-2 h-2 bg-amber-500 rounded-full shrink-0" />
                <span>Coordinate with institutions for faster approvals and better rates.</span>
              </li>  
              <li className="flex gap-3">
                <div className="mt-2 w-2 h-2 bg-amber-500 rounded-full shrink-0" />
                <span>Provide end-to-end support from inquiry to disbursement.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-28">
          <div className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-md hover:shadow-xl hover:border-teal-200 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-105 transition-transform">
              <Lightbulb className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Our Vision</h3>
            <p className="text-slate-600 leading-relaxed">
              To become one of India’s most trusted and transparent loan facilitation brands, known for our integrity and customer-centric approach.
            </p>
          </div>

          <div className="group bg-white rounded-2xl p-8 border border-slate-100 shadow-md hover:shadow-xl hover:border-indigo-200 transition-all duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-105 transition-transform">
              <Target className="h-7 w-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Our Mission</h3>
            <p className="text-slate-600 leading-relaxed">
              Guiding customers through every step of the loan process with honesty, speed, and clarity, ensuring financial empowerment for all.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div>
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Why Choose Loanbazaar?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              We bring strong market experience and a wide lender network to offer you the best financial solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<ShieldCheck className="h-6 w-6 text-teal-600" />}
              title="Backed by Smart Solutions"
              description="Leveraging strong market experience for reliable guidance."
            />
            <FeatureCard 
              icon={<Network className="h-6 w-6 text-teal-600" />}
              title="Wide Lender Network"
              description="Access to diverse products from multiple banks and NBFCs."
            />
            <FeatureCard 
              icon={<SearchCheck className="h-6 w-6 text-teal-600" />}
              title="Transparent Processing"
              description="No hidden charges, just clear communication and trust."
            />
            <FeatureCard 
              icon={<UserCheck className="h-6 w-6 text-teal-600" />}
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
  <div className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-teal-200 transition-all duration-300">
    <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-100 group-hover:ring-2 group-hover:ring-teal-200 transition-all">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-teal-700">{title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
  </div>
);

export default AboutPage;

