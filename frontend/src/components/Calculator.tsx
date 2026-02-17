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
    <div id="calculators" className="py-12 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Financial Tools</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Use our advanced calculators to plan your finances effectively.</p>
        </div>

        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          {/* Modern Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('emi')}
              className={`flex-1 py-5 px-6 text-center font-semibold text-sm md:text-base flex items-center justify-center gap-2 transition-all relative
                ${activeTab === 'emi' ? 'text-blue-600 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50/80 hover:text-gray-700'}`}
            >
              <CalculatorIcon className={`w-5 h-5 ${activeTab === 'emi' ? 'text-blue-600' : 'text-gray-400'}`} />
              EMI Calculator
              {activeTab === 'emi' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full" />}
            </button>
            <button
              onClick={() => setActiveTab('eligibility')}
              className={`flex-1 py-5 px-6 text-center font-semibold text-sm md:text-base flex items-center justify-center gap-2 transition-all relative
                ${activeTab === 'eligibility' ? 'text-blue-600 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50/80 hover:text-gray-700'}`}
            >
              <Percent className={`w-5 h-5 ${activeTab === 'eligibility' ? 'text-blue-600' : 'text-gray-400'}`} />
              Eligibility
              {activeTab === 'eligibility' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full" />}
            </button>
            <button
              onClick={() => setActiveTab('balance')}
              className={`flex-1 py-5 px-6 text-center font-semibold text-sm md:text-base flex items-center justify-center gap-2 transition-all relative
                ${activeTab === 'balance' ? 'text-blue-600 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50/80 hover:text-gray-700'}`}
            >
              <RefreshCw className={`w-5 h-5 ${activeTab === 'balance' ? 'text-blue-600' : 'text-gray-400'}`} />
              Balance Transfer
              {activeTab === 'balance' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-full" />}
            </button>
          </div>

          <div className="p-8 md:p-12">
            {/* EMI Calculator */}
            {activeTab === 'emi' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-10">
                  <SliderInput label="Loan Amount" value={amount} setValue={setAmount} min={50000} max={5000000} step={10000} prefix="₹" />
                  <SliderInput label="Interest Rate" value={rate} setValue={setRate} min={8} max={24} step={0.1} suffix="%" />
                  <SliderInput label="Tenure" value={years} setValue={setYears} min={1} max={30} step={1} suffix=" Years" />
                </div>
                <ResultBox
                  label="Monthly Payment (EMI)"
                  amount={emi}
                  buttonText="Apply Now"
                  subText="*Calculated based on 10.5% interest rate"
                />
              </div>
            )}

            {/* Eligibility Calculator */}
            {activeTab === 'eligibility' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-10">
                  <SliderInput label="Monthly Income" value={income} setValue={setIncome} min={15000} max={500000} step={1000} prefix="₹" />
                  <SliderInput label="Current EMIs" value={existingEmi} setValue={setExistingEmi} min={0} max={200000} step={1000} prefix="₹" />
                  <div className="bg-amber-50 p-4 rounded-xl text-sm text-amber-800 border border-amber-100 flex items-start gap-2">
                    <span className="text-xl">💡</span>
                    Note: Eligibility is estimated based on standard bank policies (50% FOIR).
                  </div>
                </div>
                <ResultBox
                  label="Maximum Eligible Loan"
                  amount={eligibleAmount}
                  buttonText="Check Offers"
                  color="green"
                />
              </div>
            )}

            {/* Balance Transfer Calculator */}
            {activeTab === 'balance' && (
              <div className="space-y-10">
                {/* Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <SliderInput label="Monthly Income" value={btIncome} setValue={setBtIncome} min={20000} max={500000} step={1000} prefix="₹" />
                  <SliderInput label="Outstanding Loan Amount" value={outstanding} setValue={setOutstanding} min={100000} max={5000000} step={10000} prefix="₹" />
                  <SliderInput label="Existing EMI" value={btExistingEmi} setValue={setBtExistingEmi} min={0} max={200000} step={500} prefix="₹" />
                  <SliderInput label="Desired Tenure (Years)" value={btTenure} setValue={setBtTenure} min={1} max={30} step={1} suffix=" Years" />
                </div>

                <div className="mt-6 pt-10 border-t border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-8 text-center">Your Savings & Eligibility</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Max EMI Capacity */}
                    <SummaryCard
                      label="New EMI Capacity"
                      value={btMaxEmi}
                      note="Max affordable EMI"
                      color="blue"
                    />

                    {/* Per Lakh EMI */}
                    <SummaryCard
                      label="Per Lakh EMI"
                      value={btPerLakhEmi}
                      note={`@ 10.50% for ${btTenure} Years`}
                      color="indigo"
                    />

                    {/* Max Loan Amount */}
                    <SummaryCard
                      label="Total Eligibility"
                      value={btMaxLoan}
                      note="Based on income"
                      color="purple"
                    />

                    {/* Net In Hand */}
                    <SummaryCard
                      label="Net In Hand"
                      value={btNetInHand}
                      note="Extra cash available"
                      color="green"
                      highlight
                    />
                  </div>
                </div>

                <div className="text-center mt-8">
                  <Link href="/apply" className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-4 px-10 rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Start Balance Transfer
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

// Helper Components
const SummaryCard = ({ label, value, note, color, highlight }: any) => {
  // Dynamic color mapping
  const colors: any = {
    blue: 'bg-blue-50 text-blue-700 ring-blue-100',
    indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
    purple: 'bg-purple-50 text-purple-700 ring-purple-100',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  };

  const activeColor = colors[color] || colors.blue;

  return (
    <div className={`relative p-5 rounded-2xl border transition-all duration-300 ${highlight ? 'bg-white shadow-lg border-emerald-100 ring-1 ring-emerald-100 transform -translate-y-1' : 'bg-white border-gray-100 shadow-sm hover:shadow-md'}`}>
      <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">{label}</div>
      <div className={`text-xl font-bold mb-2 ${color === 'green' ? 'text-emerald-700' : 'text-gray-900'}`}>
        ₹{formatCurrency(value)}
      </div>
      <div className="text-xs text-gray-400 font-medium">{note}</div>
    </div>
  );
}


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
    let numValue = Number(cleanValue);

    // Clamp value
    numValue = Math.min(Math.max(numValue, min), max);
    setValue(numValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  const displayValue = isEditing ? editValue : `${prefix}${formatCurrency(value)}${suffix}`;

  // Calculate percentage for slider gradient
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="group">
      <div className="flex justify-between mb-4 items-center">
        <label className="font-medium text-gray-500 group-hover:text-blue-600 transition-colors">{label}</label>
        <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 group-focus-within:border-blue-500 group-focus-within:ring-2 group-focus-within:ring-blue-100 transition-all shadow-sm w-36">
          <input
            type="text"
            value={displayValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="font-bold text-gray-900 text-right outline-none bg-transparent w-full"
          />
        </div>
      </div>

      <div className="relative w-full h-2 rounded-full bg-gray-100">
        <div
          className="absolute h-full rounded-full bg-blue-600"
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute h-6 w-6 bg-white border-2 border-blue-600 rounded-full shadow-md top-1/2 -translate-y-1/2 -ml-3 pointer-events-none transition-transform group-hover:scale-110"
          style={{ left: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const ResultBox = ({ label, amount, buttonText, subText, color = 'blue' }: any) => (
  <div className={`rounded-3xl p-8 text-center relative overflow-hidden ${color === 'green' ? 'bg-gradient-to-br from-emerald-600 to-teal-700' : 'bg-gradient-to-br from-blue-600 to-indigo-700'}`}>
    {/* Decorative circles */}
    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white opacity-10 blur-xl"></div>
    <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-white opacity-10 blur-xl"></div>

    <div className="relative z-10">
      <p className="text-blue-100 mb-2 font-medium text-lg">{label}</p>
      <p className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-tight">
        ₹{formatCurrency(amount)}
      </p>

      {subText && <p className="text-blue-200 text-sm mb-8 opacity-80">{subText}</p>}
      {!subText && <div className="mb-8"></div>}

      <Link href="/apply" className="block w-full bg-white text-blue-900 font-bold py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20">
        {buttonText}
      </Link>
    </div>
  </div>
);

export default Calculator;
