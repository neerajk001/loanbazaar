'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Calculator, Wallet, CreditCard, Calendar, ArrowRight, CheckCircle2, Percent, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const CheckEligibility = () => {
  const [income, setIncome] = useState<string>('');
  const [existingEmi, setExistingEmi] = useState<string>('');
  const [tenure, setTenure] = useState<string>('');
  
  const [maxEmiCapacity, setMaxEmiCapacity] = useState(0);
  const [maxLoanAmount, setMaxLoanAmount] = useState(0);
  const ROI = 11.0; 

  useEffect(() => {
    calculateEligibility();
  }, [income, existingEmi, tenure]);

  const calculateEligibility = () => {
    const incomeNum = Number(income) || 0;
    const existingEmiNum = Number(existingEmi) || 0;
    const tenureNum = Number(tenure) || 1;
    
    const foir = 0.50;
    const maxEmi = (incomeNum * foir) - existingEmiNum;
    const safeMaxEmi = Math.max(0, maxEmi);
    setMaxEmiCapacity(Math.round(safeMaxEmi));

    const r = ROI / 12 / 100;
    const n = tenureNum * 12;

    if (r > 0 && n > 0 && safeMaxEmi > 0) {
      const loanAmount = safeMaxEmi * ( (1 - Math.pow(1 + r, -n)) / r );
      setMaxLoanAmount(Math.round(loanAmount));
    } else {
      setMaxLoanAmount(0);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans relative overflow-hidden">
      <Navbar />

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl mix-blend-multiply animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl mix-blend-multiply animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border border-gray-200 text-sm font-semibold text-orange-600 mb-4 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>Instant Calculation</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4 tracking-tight">
            Check Your Eligibility
          </h1>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Unlock your financial potential. Get an instant estimate based on standard banking norms.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
            
            {/* Left Column: Inputs (7 cols) */}
            <div className="lg:col-span-7 p-6 md:p-12 flex flex-col justify-center space-y-8">
              <div className="space-y-6">
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 group-hover:text-orange-600 transition-colors">
                    <div className="p-1.5 bg-orange-50 rounded-lg text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                      <Wallet className="h-4 w-4" />
                    </div>
                    Net Monthly Income
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-lg">₹</span>
                    <input 
                      type="number" 
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                      placeholder="0"
                      className="w-full pl-10 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none font-bold text-gray-900 text-lg transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 group-hover:text-orange-600 transition-colors">
                    <div className="p-1.5 bg-orange-50 rounded-lg text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    Total Existing EMIs
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-lg">₹</span>
                    <input 
                      type="number" 
                      value={existingEmi}
                      onChange={(e) => setExistingEmi(e.target.value)}
                      placeholder="0"
                      className="w-full pl-10 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none font-bold text-gray-900 text-lg transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 group-hover:text-orange-600 transition-colors">
                    <div className="p-1.5 bg-orange-50 rounded-lg text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                      <Calendar className="h-4 w-4" />
                    </div>
                    Preferred Tenure (Years)
                  </label>
                  <input 
                    type="number" 
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                    placeholder="1"
                    min="1"
                    max="30"
                    className="w-full px-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-orange-100 focus:border-orange-500 outline-none font-bold text-gray-900 text-lg transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Results (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-blue-900 to-slate-900 text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
              {/* Decorative overlays */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10 space-y-8">
                <div className="text-center lg:text-left">
                  <p className="text-blue-200 font-medium mb-2 text-sm uppercase tracking-widest">Maximum Loan Amount</p>
                  <div className="text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
                    ₹{formatCurrency(maxLoanAmount)}
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-blue-100 border border-white/10">
                    <CheckCircle2 className="h-3 w-3 text-green-400" />
                    Calculated at 50% FOIR
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Wallet className="h-5 w-5 text-blue-300" />
                      </div>
                      <span className="text-blue-100 text-sm font-medium">Max EMI Capacity</span>
                    </div>
                    <span className="font-bold text-white text-lg">₹{formatCurrency(maxEmiCapacity)}</span>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Percent className="h-5 w-5 text-purple-300" />
                      </div>
                      <span className="text-blue-100 text-sm font-medium">Assumed ROI</span>
                    </div>
                    <span className="font-bold text-white text-lg">{ROI.toFixed(2)}%</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-8 lg:mt-0">
                <Link 
                  href="/apply"
                  className="group w-full inline-flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-900/20 transform hover:-translate-y-1 active:translate-y-0"
                >
                  Apply Now 
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <p className="text-[10px] text-blue-300/60 mt-4 text-center">
                  *Indicative figures only. Final amount subject to credit checks.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default CheckEligibility;
