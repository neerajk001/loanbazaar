'use client';
import React from 'react';
import { LogIn, FileCheck, ClipboardCheck, CheckCircle2, Wallet, ArrowRight } from 'lucide-react';

const FundingPath = () => {
  const steps = [
    {
      number: '1',
      title: 'Login',
      description: 'Sign in to your account to begin your loan application',
      icon: LogIn,
      color: 'blue'
    },
    {
      number: '2',
      title: 'Review & Verification',
      description: 'We review your application and verify your documents',
      icon: FileCheck,
      color: 'orange'
    },
    {
      number: '3',
      title: 'Underwriting',
      description: 'Our team evaluates your eligibility and creditworthiness',
      icon: ClipboardCheck,
      color: 'blue'
    },
    {
      number: '4',
      title: 'Approval',
      description: 'Receive your loan approval with terms and conditions',
      icon: CheckCircle2,
      color: 'orange'
    },
    {
      number: '5',
      title: 'Disbursement',
      description: 'Get your funds transferred directly to your account',
      icon: Wallet,
      color: 'blue'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50/25 via-slate-50/90 to-orange-50/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 mb-4">
            Your Path to Funding
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A simple, transparent process from application to disbursement
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-orange-200 to-blue-200" style={{ top: '96px' }} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-6 lg:gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isBlue = step.color === 'blue';
              
              return (
                <div key={index} className="relative flex flex-col items-center h-full">
                  {/* Step Card */}
                  <div className={`w-full max-w-[280px] mx-auto bg-white rounded-2xl p-6 shadow-lg border-2 flex flex-col h-full ${
                    isBlue ? 'border-blue-100' : 'border-orange-100'
                  } hover:shadow-xl transition-all duration-300 relative z-10`}>
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto ${
                      isBlue ? 'bg-blue-50' : 'bg-orange-50'
                    }`}>
                      <Icon className={`w-8 h-8 ${
                        isBlue ? 'text-blue-600' : 'text-orange-600'
                      }`} />
                    </div>

                    {/* Step Number */}
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-white mb-3 mx-auto ${
                      isBlue ? 'bg-blue-600' : 'bg-orange-600'
                    }`}>
                      {step.number}
                    </div>

                    {/* Title */}
                    <h3 className={`text-lg font-bold mb-3 text-center min-h-[56px] flex items-center justify-center ${
                      isBlue ? 'text-blue-900' : 'text-orange-900'
                    }`}>
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 text-center leading-relaxed flex-1">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow - Mobile/Tablet */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex items-center justify-center my-4">
                      <ArrowRight className={`w-6 h-6 ${
                        isBlue ? 'text-blue-400' : 'text-orange-400'
                      }`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="/apply"
            className="inline-flex items-center gap-2 bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Start Your Application
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FundingPath;

