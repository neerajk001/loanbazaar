'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Info, Calculator, CheckCircle, Phone, ChevronDown, Home, Wallet, Shield } from 'lucide-react';
import { usePathname } from 'next/navigation';

import Image from 'next/image';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoanDropdown, setShowLoanDropdown] = useState(false);
  const [showInsuranceDropdown, setShowInsuranceDropdown] = useState(false);
  const [showMobileLoanDropdown, setShowMobileLoanDropdown] = useState(false);
  const [showMobileInsuranceDropdown, setShowMobileInsuranceDropdown] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const isActive = (path: string) => {
    if (path === '/loan') {
      return pathname.startsWith('/loan/') ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-blue-600 font-medium';
    }
    if (path === '/insurance') {
      return pathname === '/insurance' || pathname.startsWith('/insurance/') ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-blue-600 font-medium';
    }
    return pathname === path ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-blue-600 font-medium';
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 px-6 sm:px-8 py-2 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex justify-between items-center h-14 lg:h-16 max-w-7xl mx-auto">

          {/* Left: Logo */}
          <div className="shrink-0 flex items-center cursor-pointer relative">
            <Link href="/" className="flex items-center">
              <Image src="/company.png" alt="loanbazaar" width={500} height={250} className="h-10 md:h-12 w-auto" priority />
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex items-center justify-center space-x-6 lg:space-x-8 xl:space-x-10">
            <Link href="/" className={`${isActive('/')} whitespace-nowrap transition-colors text-sm`}>Home</Link>
            <Link href="/about" className={`${isActive('/about')} whitespace-nowrap transition-colors text-sm`}>About Us</Link>

            {/* Loans Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => setShowLoanDropdown(true)}
              onMouseLeave={() => setShowLoanDropdown(false)}
            >
              <div
                className={`${isActive('/loan')} whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer text-sm`}
              >
                Loans
                <ChevronDown className={`h-3 w-3 transition-transform ${showLoanDropdown ? 'rotate-180' : ''}`} />
              </div>

              {showLoanDropdown && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[220px] z-50">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-col">
                      <Link
                        href="/loan/personal-loan"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors group"
                      >
                        <Image src="/card-logo/PersonalLoan.png" alt="Personal Loan" width={18} height={18} className="object-contain" />
                        <span className="text-xs font-semibold text-gray-700 group-hover:text-blue-700">Personal Loan</span>
                      </Link>

                      <Link
                        href="/loan/business-loan"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-purple-50 transition-colors group"
                      >
                        <Image src="/card-logo/BusinessLoan.png" alt="Business Loan" width={18} height={18} className="object-contain" />
                        <span className="text-xs font-semibold text-gray-700 group-hover:text-purple-700">Business Loan</span>
                      </Link>

                      <Link
                        href="/loan/home-loan"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 transition-colors group"
                      >
                        <Image src="/card-logo/HomeLoan (2).png" alt="Home Loan" width={18} height={18} className="object-contain" />
                        <span className="text-xs font-semibold text-gray-700 group-hover:text-green-700">Home Loan</span>
                      </Link>

                      <Link
                        href="/loan/loan-against-property"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors group"
                      >
                        <Image src="/card-logo/LAP (2).png" alt="LAP" width={18} height={18} className="object-contain" />
                        <span className="text-xs font-semibold text-gray-700 group-hover:text-orange-700">Loan Against Property</span>
                      </Link>

                      <Link
                        href="/loan/education-loan"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 transition-colors group"
                      >
                        <Image src="/card-logo/EducationLoan.png" alt="Education Loan" width={18} height={18} className="object-contain" />
                        <span className="text-xs font-semibold text-gray-700 group-hover:text-indigo-700">Education Loan</span>
                      </Link>

                      <Link
                        href="/loan/car-loan"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-teal-50 transition-colors group"
                      >
                        <Image src="/card-logo/CarLoan (2).png" alt="Car Loan" width={18} height={18} className="object-contain" />
                        <span className="text-xs font-semibold text-gray-700 group-hover:text-teal-700">Car Loan</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Insurance Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => setShowInsuranceDropdown(true)}
              onMouseLeave={() => setShowInsuranceDropdown(false)}
            >
              <div
                className={`${isActive('/insurance')} whitespace-nowrap transition-colors flex items-center gap-1 cursor-pointer text-sm`}
              >
                Insurance
                <ChevronDown className={`h-3 w-3 transition-transform ${showInsuranceDropdown ? 'rotate-180' : ''}`} />
              </div>

              {showInsuranceDropdown && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[220px] z-50">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex flex-col">
                      <Link
                        href="/insurance/health-insurance"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-rose-50 transition-colors group"
                      >
                        <Image src="/card-logo/HealthInsurance.png" alt="Health Insurance" width={18} height={18} className="object-contain" />
                        <span className="text-xs font-semibold text-gray-700 group-hover:text-rose-700">Health Insurance</span>
                      </Link>

                      <Link
                        href="/insurance/term-life-insurance"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors group"
                      >
                        <Image src="/card-logo/terminsurance.png" alt="Term Life" width={18} height={18} className="object-contain" />
                        <span className="text-xs font-semibold text-gray-700 group-hover:text-blue-700">Term Life</span>
                      </Link>

                      <Link
                        href="/insurance/car-insurance"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 transition-colors group"
                      >
                        <Image src="/card-logo/CarInsurance.png" alt="Car Insurance" width={18} height={18} className="object-contain" />
                        <span className="text-xs font-semibold text-gray-700 group-hover:text-green-700">Car Insurance</span>
                      </Link>

                      <Link
                        href="/insurance/bike-insurance"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-orange-50 transition-colors group"
                      >
                        <Image src="/card-logo/BikeInsurance.png" alt="Bike Insurance" width={18} height={18} className="object-contain" />
                        <span className="text-xs font-semibold text-gray-700 group-hover:text-orange-700">Bike Insurance</span>
                      </Link>

                      <Link
                        href="/insurance/loan-protector"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-purple-50 transition-colors group"
                      >
                        <Image src="/card-logo/LoanProtector.png" alt="Loan Protector" width={18} height={18} className="object-contain" />
                        <span className="text-xs font-semibold text-gray-700 group-hover:text-purple-700">Loan Protector</span>
                      </Link>

                      <Link
                        href="/insurance/emi-protector"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 transition-colors group"
                      >
                        <Image src="/card-logo/EMI Protector.png" alt="EMI Protector" width={18} height={18} className="object-contain" />
                        <span className="text-xs font-semibold text-gray-700 group-hover:text-indigo-700">EMI Protector</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/calculator" className={`${isActive('/calculator')} whitespace-nowrap transition-colors text-sm`}>Calculator</Link>
            <Link href="/contact" className={`${isActive('/contact')} whitespace-nowrap transition-colors text-sm`}>Contact Us</Link>
          </div>

          <div className="flex items-center gap-4 pr-2">
            <Link href="/consultancy" className="hidden md:block bg-blue-600 text-white px-5 py-2 rounded-full font-bold text-xs hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
              Free Consultancy
            </Link>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center z-50 relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-900 hover:text-blue-600 focus:outline-none p-1 transition-colors"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {
          isOpen && (
            <div className="md:hidden fixed inset-x-0 top-[80px] mx-4 p-4 bg-gray-900/95 backdrop-blur-md rounded-3xl border border-white/10 overflow-y-auto animate-in slide-in-from-top-5 duration-200 shadow-2xl">
              <div className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-all
                    ${pathname === '/'
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-gray-400 font-medium hover:bg-white/5 hover:text-white'}`}
                >
                  <Home className="h-5 w-5" />
                  Home
                </Link>

                <Link
                  href="/about"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-all
                    ${pathname === '/about'
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-gray-400 font-medium hover:bg-white/5 hover:text-white'}`}
                >
                  <Info className="h-5 w-5" />
                  About Us
                </Link>

                {/* Loans Mobile Dropdown */}
                <div>
                  <button
                    onClick={() => setShowMobileLoanDropdown(!showMobileLoanDropdown)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-base transition-all
                      ${pathname.startsWith('/loan/')
                        ? 'bg-white/10 text-white font-bold'
                        : 'text-gray-400 font-medium hover:bg-white/5 hover:text-white'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Wallet className="h-5 w-5" />
                      Loans
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showMobileLoanDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showMobileLoanDropdown && (
                    <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-4">
                      <Link href="/loan/personal-loan" className="text-gray-400 hover:text-white block py-2 text-sm">Personal Loan</Link>
                      <Link href="/loan/business-loan" className="text-gray-400 hover:text-white block py-2 text-sm">Business Loan</Link>
                      <Link href="/loan/home-loan" className="text-gray-400 hover:text-white block py-2 text-sm">Home Loan</Link>
                      <Link href="/loan/loan-against-property" className="text-gray-400 hover:text-white block py-2 text-sm">Mortgage Loan</Link>
                      <Link href="/loan/education-loan" className="text-gray-400 hover:text-white block py-2 text-sm">Education Loan</Link>
                      <Link href="/loan/car-loan" className="text-gray-400 hover:text-white block py-2 text-sm">Car Loan</Link>
                    </div>
                  )}
                </div>

                {/* Insurance Mobile Dropdown */}
                <div>
                  <button
                    onClick={() => setShowMobileInsuranceDropdown(!showMobileInsuranceDropdown)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-base transition-all
                      ${pathname.startsWith('/insurance/')
                        ? 'bg-white/10 text-white font-bold'
                        : 'text-gray-400 font-medium hover:bg-white/5 hover:text-white'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5" />
                      Insurance
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showMobileInsuranceDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showMobileInsuranceDropdown && (
                    <div className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-4">
                      <Link href="/insurance/health-insurance" className="text-gray-400 hover:text-white block py-2 text-sm">Health Insurance</Link>
                      <Link href="/insurance/term-life-insurance" className="text-gray-400 hover:text-white block py-2 text-sm">Term Life</Link>
                      <Link href="/insurance/car-insurance" className="text-gray-400 hover:text-white block py-2 text-sm">Car Insurance</Link>
                      <Link href="/insurance/bike-insurance" className="text-gray-400 hover:text-white block py-2 text-sm">Bike Insurance</Link>
                      <Link href="/insurance/loan-protector" className="text-gray-400 hover:text-white block py-2 text-sm">Loan Protector</Link>
                      <Link href="/insurance/emi-protector" className="text-gray-400 hover:text-white block py-2 text-sm">EMI Protector</Link>
                    </div>
                  )}
                </div>

                <Link
                  href="/calculator"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-all
                    ${pathname === '/calculator'
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-gray-400 font-medium hover:bg-white/5 hover:text-white'}`}
                >
                  <Calculator className="h-5 w-5" />
                  Calculator
                </Link>

                <Link
                  href="/contact"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-all
                    ${pathname === '/contact'
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-gray-400 font-medium hover:bg-white/5 hover:text-white'}`}
                >
                  <Phone className="h-5 w-5" />
                  Contact Us
                </Link>

                <Link
                  href="/consultancy"
                  className="flex items-center justify-center gap-2 w-full bg-white text-gray-900 px-6 py-3 rounded-xl font-bold text-base hover:bg-gray-100 transition-all shadow-md mt-4"
                >
                  <CheckCircle className="h-5 w-5" />
                  Free Consultancy
                </Link>
              </div>
            </div>
          )
        }
      </nav >
    </>
  );
};

export default Navbar;
