'use client';
import React from 'react';
import { LogIn, FileText, ClipboardCheck, PhoneCall, Banknote, ArrowRight } from 'lucide-react';

const Process = () => {
  const steps = [
    { id: 1, title: 'Login', description: 'Create secure account', icon: LogIn },
    { id: 2, title: 'Details', description: 'Fill application form', icon: FileText },
    { id: 3, title: 'Review', description: 'Verify & submit', icon: ClipboardCheck },
    { id: 4, title: 'Call', description: 'Expert consultation', icon: PhoneCall },
    { id: 5, title: 'Funds', description: 'Quick disbursement', icon: Banknote },
  ];

  return (
    <div id="process" className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900">
            Your Path to Funding
          </h2>
        </div>

        <div className="relative">
          {/* Connecting Line with Gradient */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-200 via-blue-100 to-orange-200 -translate-y-1/2 z-0 rounded-full" />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 lg:gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex flex-col items-center text-center group cursor-pointer">
                  
                  {/* Icon Circle */}
                  <div className="w-20 h-20 bg-white border-4 border-blue-50 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:border-orange-100 group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300 relative z-10">
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-orange-50 transition-colors duration-300">
                      <Icon className="w-6 h-6 text-blue-600 group-hover:text-orange-600 transition-colors duration-300" strokeWidth={2} />
                    </div>
                    
                    {/* Step Number Badge */}
                    <div className="absolute -top-1 -right-1 w-7 h-7 bg-blue-900 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-white group-hover:bg-orange-600 transition-colors duration-300 shadow-sm">
                      {step.id}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-900 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-[140px] group-hover:text-gray-700">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <a 
            href="/apply"  
            className="inline-flex items-center gap-2 bg-white border border-blue-100 px-8 py-3 rounded-full text-blue-900 font-bold shadow-sm hover:bg-blue-50 hover:border-blue-200 hover:shadow-md transition-all group"
          >
            Start Your Application <ArrowRight className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Process;
