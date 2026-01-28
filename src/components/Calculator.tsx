'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calculator as CalculatorIcon, Percent, RefreshCw } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const Calculator = () => {
  const [activeTab, setActiveTab] = useState<'emi' | 'eligibility' | 'balance'>('emi');

  // EMI State - Default: 10 Lakhs, 10.5%, 5 years
  const [amount, setAmount] = useState(1000000);
  const [rate, setRate] = useState(10.5);
  const [years, setYears] = useState(5);
  const [emi, setEmi] = useState(0);

  // Eligibility State - Default: 50k income, 10k existing EMI
  const [income, setIncome] = useState(50000);
  const [existingEmi, setExistingEmi] = useState(10000);
  const [eligibleAmount, setEligibleAmount] = useState(0);

  // Balance Transfer State - Default: 50k income, 5L outstanding, 10k existing EMI, 5 years
  const [btIncome, setBtIncome] = useState(50000);
  const [outstanding, setOutstanding] = useState(500000);
  const [btExistingEmi, setBtExistingEmi] = useState(10000);
  const [btTenure, setBtTenure] = useState(5);
  
  // BT Results
  const [btMaxEmi, setBtMaxEmi] = useState(0);
  const [btPerLakhEmi, setBtPerLakhEmi] = useState(0);
  const [btMaxLoan, setBtMaxLoan] = useState(0);
  const [btNetInHand, setBtNetInHand] = useState(0);

  // EMI Calculation
  useEffect(() => {
    const r = rate / 12 / 100;
    const n = years * 12;
    if (amount > 0 && rate > 0 && years > 0) {
      const calculatedEmi = amount * r * (Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
      setEmi(Math.round(calculatedEmi));
    }
  }, [amount, rate, years]);

  // Eligibility Calculation (Simple logic: 50% FOIR)
  useEffect(() => {
    const maxEmi = income * 0.5 - existingEmi;
    // Reverse calculate loan amount from maxEmi assuming 10.5% for 5 years (standard)
    const r = 10.5 / 12 / 100;
    const n = 5 * 12;
    if (maxEmi > 0) {
      const possibleLoan = maxEmi * ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)));
      setEligibleAmount(Math.round(possibleLoan));
    } else {
      setEligibleAmount(0);
    }
  }, [income, existingEmi]);

  // Balance Transfer Calculation
  useEffect(() => {
    // Constants
    const BT_RATE = 10.5;
    const FOIR = 0.70; // 70% based on user requirement

    // 1. Calculate Max EMI Capacity
    const maxCapacity = (btIncome * FOIR) - btExistingEmi;
    setBtMaxEmi(Math.max(0, Math.round(maxCapacity)));

    // 2. Calculate Per Lakh EMI
    // EMI for 1,00,000 at 10.5% for btTenure years
    const r = BT_RATE / 12 / 100;
    const n = btTenure * 12;
    
    let perLakh = 0;
    if (r > 0 && n > 0) {
      perLakh = 100000 * r * (Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
    }
    setBtPerLakhEmi(Math.round(perLakh));

    // 3. Calculate Max Loan Amount
    // Derived from Max EMI Capacity using the same rate and tenure
    let maxLoan = 0;
    if (maxCapacity > 0 && r > 0 && n > 0) {
      maxLoan = maxCapacity * ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)));
    }
    setBtMaxLoan(Math.round(maxLoan));

    // 4. Net In Hand
    const net = Math.max(0, maxLoan - outstanding);
    setBtNetInHand(Math.round(net));

  }, [btIncome, outstanding, btExistingEmi, btTenure]);

  return (
    <div id="calculators" className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-6 pl-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Financial Tools</h1>
          <h2 className="text-xl font-bold text-gray-900">Use our tools to estimate your payments instantly.</h2>
        </div>

        <div className="max-w-5xl mx-auto bg-gray-100 rounded-2xl border border-black overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('emi')}
              className={`flex-1 py-4 px-6 text-center font-bold whitespace-nowrap flex items-center justify-center gap-2 transition-colors
                ${activeTab === 'emi' ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-600' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
            >
              <CalculatorIcon className="w-5 h-5" />
              EMI Calculator
            </button>
            <button 
              onClick={() => setActiveTab('eligibility')}
              className={`flex-1 py-4 px-6 text-center font-bold whitespace-nowrap flex items-center justify-center gap-2 transition-colors
                ${activeTab === 'eligibility' ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-600' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
            >
              <Percent className="w-5 h-5" />
              Check Eligibility
            </button>
            <button 
              onClick={() => setActiveTab('balance')}
              className={`flex-1 py-4 px-6 text-center font-bold whitespace-nowrap flex items-center justify-center gap-2 transition-colors
                ${activeTab === 'balance' ? 'bg-orange-50 text-orange-700 border-b-2 border-orange-600' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
            >
              <RefreshCw className="w-5 h-5" />
              Balance Transfer
            </button>
          </div>

          <div className="p-6 md:p-12">
            {/* EMI Calculator */}
            {activeTab === 'emi' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <SliderInput label="Loan Amount" value={amount} setValue={setAmount} min={50000} max={5000000} step={10000} prefix="₹" />
                  <SliderInput label="Interest Rate" value={rate} setValue={setRate} min={8} max={24} step={0.1} suffix="%" />
                  <SliderInput label="Tenure" value={years} setValue={setYears} min={1} max={30} step={1} suffix=" Years" />
                </div>
                <ResultBox 
                  label="Your Monthly EMI" 
                  amount={emi} 
                  buttonText="Apply for this Loan" 
                />
              </div>
            )}

            {/* Eligibility Calculator */}
            {activeTab === 'eligibility' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <SliderInput label="Monthly Income" value={income} setValue={setIncome} min={15000} max={500000} step={1000} prefix="₹" />
                  <SliderInput label="Existing EMIs" value={existingEmi} setValue={setExistingEmi} min={0} max={200000} step={1000} prefix="₹" />
                  <div className="bg-orange-50 p-4 rounded-lg text-sm text-orange-800 border border-orange-100">
                    *Estimated based on standard bank policies. Actual eligibility may vary.
                  </div>
                </div>
                <ResultBox 
                  label="You are Eligible for" 
                  amount={eligibleAmount} 
                  buttonText="Check Offers" 
                />
              </div>
            )}

            {/* Balance Transfer Calculator */}
            {activeTab === 'balance' && (
              <div className="space-y-8">
                {/* Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <SliderInput label="Monthly Income" value={btIncome} setValue={setBtIncome} min={20000} max={500000} step={1000} prefix="₹" />
                   <SliderInput label="BT Loan Amount Outstanding" value={outstanding} setValue={setOutstanding} min={100000} max={5000000} step={10000} prefix="₹" />
                   <SliderInput label="Existing EMI" value={btExistingEmi} setValue={setBtExistingEmi} min={0} max={200000} step={500} prefix="₹" />
                   <SliderInput label="Desired Tenure (Years)" value={btTenure} setValue={setBtTenure} min={1} max={30} step={1} suffix=" Years" />
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Your Loan Eligibility Result</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Max EMI Capacity */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
                      <div className="text-sm text-gray-500 font-medium mb-1">Max EMI Capacity</div>
                      <div className="bg-orange-100 text-orange-800 font-bold text-xl py-1 rounded mb-2">
                        ₹{formatCurrency(btMaxEmi)}
                      </div>
                      <div className="text-xs text-gray-400">This will be new EMI</div>
                    </div>

                    {/* Per Lakh EMI */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
                      <div className="text-sm text-gray-500 font-medium mb-1">Per Lakh EMI</div>
                      <div className="bg-orange-100 text-orange-800 font-bold text-xl py-1 rounded mb-2">
                        ₹{formatCurrency(btPerLakhEmi)}
                      </div>
                      <div className="text-xs text-gray-400">@ 10.50% on {btTenure} Years</div>
                    </div>

                    {/* Max Loan Amount */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
                      <div className="text-sm text-gray-500 font-medium mb-1">Max Loan Amount</div>
                      <div className="bg-orange-100 text-orange-800 font-bold text-xl py-1 rounded mb-2">
                        ₹{formatCurrency(btMaxLoan)}
                      </div>
                      <div className="text-xs text-gray-400">Total Eligibility</div>
                    </div>

                    {/* Net In Hand */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 text-center shadow-sm">
                      <div className="text-sm text-gray-500 font-medium mb-1">Net In Hand</div>
                      <div className="bg-orange-100 text-orange-800 font-bold text-xl py-1 rounded mb-2">
                        ₹{formatCurrency(btNetInHand)}
                      </div>
                      <div className="text-xs text-gray-400">After BT in hand</div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-8">
                   <Link href="/apply" className="inline-block bg-orange-600 text-white font-bold py-3 px-8 rounded-full hover:bg-orange-700 transition-colors shadow-lg">
                     Apply Now
                   </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components to clean up code
const SliderInput = ({ label, value, setValue, min, max, step, prefix = '', suffix = '' }: any) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleFocus = () => {
    setIsEditing(true);
    setEditValue(value.toString());
  };

  const handleBlur = () => {
    setIsEditing(false);
    const cleanValue = editValue.replace(/,/g, '').replace(/[^0-9.]/g, '');
    const numValue = Number(cleanValue);
    
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      setValue(numValue);
    } else if (!isNaN(numValue) && numValue < min) {
      setValue(min);
    } else if (!isNaN(numValue) && numValue > max) {
      setValue(max);
    } else {
      setValue(value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  const displayValue = isEditing ? editValue : `${prefix}${formatCurrency(value)}${suffix}`;

  return (
    <div>
      <div className="flex justify-between mb-2 items-center">
        <label className="font-semibold text-gray-700">{label}</label>
        <div className="bg-white px-3 py-1.5 rounded-lg border-2 border-gray-200 focus-within:border-blue-500 transition-all">
          <input
            type="text"
            value={displayValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="font-bold text-blue-900 text-right outline-none bg-transparent w-24"
          />
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
      />
    </div>
  );
};

const ResultBox = ({ label, amount, buttonText }: any) => (
  <div className="bg-blue-50 rounded-xl p-8 text-center">
    <p className="text-gray-600 mb-2">{label}</p>
    <p className="text-4xl md:text-5xl font-bold text-blue-900 mb-8">
      ₹{formatCurrency(amount)}
    </p>
    <Link href="/apply" className="block w-full bg-orange-600 text-white font-bold py-4 rounded-lg hover:bg-orange-700 transition-colors shadow-md text-center">
      {buttonText}
    </Link>
  </div>
);

export default Calculator;
