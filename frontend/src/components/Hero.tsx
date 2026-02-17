'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Phone, Star, ArrowRight, TrendingUp, Zap, Home as HomeIcon, Briefcase, GraduationCap, Shield as ShieldIcon, Car } from 'lucide-react';

const RotatingProductCard = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const products = [
    {
      bgColor: 'bg-green-700',
      shadowColor: 'shadow-green-900/20',
      icon: TrendingUp,
      iconBg: 'bg-white/10',
      title: 'Personal Loan',
      value: '₹25L+',
      interestRate: 'From 10.5% p.a.',
      processingTime: '24 Hours',
      feature: 'No Collateral Required',
      statLabel: 'Active Loans',
      statValue: '5000+',
      progressWidth: 'w-[95%]',
      progressColor: 'bg-green-400',
      badge: 'Most Popular',
      applyUrl: '/loan/personal-loan'
    },
    {
      bgColor: 'bg-blue-700',
      shadowColor: 'shadow-blue-900/20',
      icon: Briefcase,
      iconBg: 'bg-white/10',
      title: 'Business Loan',
      value: '₹50L+',
      interestRate: 'From 12% p.a.',
      processingTime: '48 Hours',
      feature: 'Flexible Repayment',
      statLabel: 'Businesses Funded',
      statValue: '3000+',
      progressWidth: 'w-[88%]',
      progressColor: 'bg-blue-400',
      badge: 'Fast Approval',
      applyUrl: '/loan/business-loan'
    },
    {
      bgColor: 'bg-purple-700',
      shadowColor: 'shadow-purple-900/20',
      icon: HomeIcon,
      iconBg: 'bg-white/10',
      title: 'Home Loan',
      value: '₹1Cr+',
      interestRate: 'From 8.5% p.a.',
      processingTime: '7 Days',
      feature: 'Up to 30 Years Tenure',
      statLabel: 'Dream Homes',
      statValue: '2000+',
      progressWidth: 'w-[92%]',
      progressColor: 'bg-purple-400',
      badge: 'Lowest Rate',
      applyUrl: '/loan/home-loan'
    },
    {
      bgColor: 'bg-orange-700',
      shadowColor: 'shadow-orange-900/20',
      icon: GraduationCap,
      iconBg: 'bg-white/10',
      title: 'Education Loan',
      value: '₹30L+',
      interestRate: 'From 9.5% p.a.',
      processingTime: '3 Days',
      feature: 'Study Abroad Support',
      statLabel: 'Students Supported',
      statValue: '1500+',
      progressWidth: 'w-[85%]',
      progressColor: 'bg-orange-400',
      badge: 'Easy EMI',
      applyUrl: '/loan/education-loan'
    },
    {
      bgColor: 'bg-indigo-700',
      shadowColor: 'shadow-indigo-900/20',
      icon: ShieldIcon,
      iconBg: 'bg-white/10',
      title: 'Insurance',
      value: '₹1Cr',
      interestRate: 'Premium ₹500/mo',
      processingTime: 'Instant',
      feature: 'Comprehensive Coverage',
      statLabel: 'Lives Protected',
      statValue: '10000+',
      progressWidth: 'w-[90%]',
      progressColor: 'bg-indigo-400',
      badge: 'Best Value',
      applyUrl: '/insurance/health-insurance'
    },
    {
      bgColor: 'bg-teal-700',
      shadowColor: 'shadow-teal-900/20',
      icon: Car,
      iconBg: 'bg-white/10',
      title: 'Car Loan',
      value: '₹20L+',
      interestRate: 'From 8.75% p.a.',
      processingTime: '2 Days',
      feature: 'New & Used Cars',
      statLabel: 'Cars Financed',
      statValue: '4000+',
      progressWidth: 'w-[87%]',
      progressColor: 'bg-teal-400',
      badge: 'Quick Disbursal',
      applyUrl: '/loan/car-loan'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % products.length);
        setIsTransitioning(false);
      }, 300); // Half of transition duration
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [products.length]);

  const currentProduct = products[currentIndex];
  const Icon = currentProduct.icon;

  return (
    <Link
      href={currentProduct.applyUrl}
      className="bg-white rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden group min-h-[300px] shadow-sm border-2 transition-all duration-700 ease-in-out cursor-pointer hover:shadow-md hover:scale-[1.02]"
      style={{ borderColor: currentProduct.progressColor.replace('bg-', '#').replace('green-400', '#4ade80').replace('blue-400', '#60a5fa').replace('purple-400', '#c084fc').replace('orange-400', '#fb923c').replace('indigo-400', '#818cf8').replace('teal-400', '#2dd4bf') }}
    >
      {/* Background Icon */}
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all duration-700 transform group-hover:scale-110" style={{ color: currentProduct.progressColor.replace('bg-', '#').replace('green-400', '#4ade80').replace('blue-400', '#60a5fa').replace('purple-400', '#c084fc').replace('orange-400', '#fb923c').replace('indigo-400', '#818cf8').replace('teal-400', '#2dd4bf') }}>
        <Icon className={`h-40 w-40 rotate-12 transition-all duration-700 ${isTransitioning ? 'scale-90 opacity-0' : 'scale-100 opacity-100'}`} />
      </div>

      {/* Apply Button Badge */}
      <div
        className={`absolute top-6 right-6 px-4 py-2 rounded-full font-bold text-gray-900 text-sm transition-all duration-500 shadow-md flex items-center gap-1 ${isTransitioning ? 'opacity-0 -translate-x-20' : 'opacity-100 translate-x-0'}`}
        style={{ backgroundColor: currentProduct.progressColor.replace('bg-', '#').replace('green-400', '#4ade80').replace('blue-400', '#60a5fa').replace('purple-400', '#c084fc').replace('orange-400', '#fb923c').replace('indigo-400', '#818cf8').replace('teal-400', '#2dd4bf') }}
      >
        Apply Now
        <ArrowRight className="h-3 w-3" />
      </div>

      {/* Main Content */}
      <div key={`content-${currentIndex}`} className={`relative z-10 transition-all duration-500 ${isTransitioning ? 'opacity-0 -translate-x-full' : 'opacity-100 translate-x-0'}`}>
        <div className={`w-14 h-14 bg-gray-50 border rounded-2xl flex items-center justify-center mb-6 transition-all duration-700 transform ${isTransitioning ? 'rotate-90 scale-75' : 'rotate-0 scale-100'}`} style={{ borderColor: currentProduct.progressColor.replace('bg-', '#').replace('green-400', '#4ade80').replace('blue-400', '#60a5fa').replace('purple-400', '#c084fc').replace('orange-400', '#fb923c').replace('indigo-400', '#818cf8').replace('teal-400', '#2dd4bf'), color: currentProduct.progressColor.replace('bg-', '#').replace('green-400', '#4ade80').replace('blue-400', '#60a5fa').replace('purple-400', '#c084fc').replace('orange-400', '#fb923c').replace('indigo-400', '#818cf8').replace('teal-400', '#2dd4bf') }}>
          <Icon className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2 transition-all duration-500">{currentProduct.title}</h3>
        <div className="text-5xl font-bold tracking-tight mb-4 transition-all duration-500 text-gray-900">{currentProduct.value}</div>

        {/* Info Pills */}
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
            <span className="text-xs font-semibold text-gray-900">{currentProduct.interestRate}</span>
          </div>
          <div className="bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
            <span className="text-xs font-semibold text-gray-900">⚡ {currentProduct.processingTime}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600">✓ {currentProduct.feature}</p>
      </div>

      {/* Stats Section */}
      <div key={`stats-${currentIndex}`} className={`relative z-10 bg-gray-50 border rounded-2xl p-4 mt-6 transition-all duration-500 delay-75 ${isTransitioning ? 'opacity-0 -translate-x-full' : 'opacity-100 translate-x-0'}`} style={{ borderColor: currentProduct.progressColor.replace('bg-', '#').replace('green-400', '#4ade80').replace('blue-400', '#60a5fa').replace('purple-400', '#c084fc').replace('orange-400', '#fb923c').replace('indigo-400', '#818cf8').replace('teal-400', '#2dd4bf') }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs text-gray-500 mb-1">{currentProduct.statLabel}</div>
            <div className="text-2xl font-bold text-gray-900">{currentProduct.statValue}</div>
          </div>
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-0.5 shadow-lg transition-all duration-500 ${isTransitioning ? 'scale-0 rotate-180' : 'scale-100 rotate-0'}`}>
            <div className="w-full h-full rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-lg">🎯</span>
            </div>
          </div>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full ${currentProduct.progressWidth} ${currentProduct.progressColor} rounded-full transition-all duration-1000 ease-out ${isTransitioning ? 'w-0' : ''}`}></div>
        </div>
      </div>
    </Link>
  );
};

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white py-12 lg:py-20 overflow-hidden">
      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center">
              <div className="h-16 w-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-green-700" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">Talk to an Expert</h3>
              <p className="text-gray-500 mb-6">
                Get instant guidance on your loan requirements. Our experts are available 10 AM - 7 PM.
              </p>

              <a
                href="tel:+919665248445"
                className="flex items-center justify-center gap-2 w-full bg-green-700 text-white font-bold py-3.5 rounded-xl hover:bg-green-800 transition-colors shadow-lg shadow-green-200 mb-3"
              >
                <Phone className="h-5 w-5" />
                Call +91 96652 48445
              </a>

              <p className="text-xs text-gray-400">
                Standard calling charges may apply
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Block 1: Main Hero Copy (Spans 2 cols on md+) */}
          <div className="md:col-span-2 bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-sm border-2 border-green-200 flex flex-col justify-center items-start relative overflow-hidden min-h-[450px]">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-green-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60 pointer-events-none"></div>


            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.1] mb-6 relative z-10 tracking-tight">
              Instant Loans with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-green-500">Smart Banking</span>
            </h1>

            <p className="text-lg text-gray-500 mb-10 max-w-xl leading-relaxed relative z-10">
              Experience the future of lending with our AI-driven approval system. Low interest rates, minimal documentation, and lightning-fast processing.
            </p>

            <div className="flex flex-wrap items-center gap-4 relative z-10">
              <Link href="/apply" className="bg-green-700 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-800 transition-all shadow-xl shadow-green-200 hover:shadow-2xl hover:shadow-green-300 hover:-translate-y-1 flex items-center gap-2 group">
                Get Started Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button onClick={() => setIsModalOpen(true)} className="px-8 py-4 rounded-2xl font-bold text-green-800 bg-white border-2 border-green-100 hover:bg-green-50 hover:border-green-200 transition-all shadow-lg shadow-green-100/50 hover:shadow-xl hover:shadow-green-100 hover:-translate-y-0.5 active:scale-95 backdrop-blur-sm">
                Talk to Expert
              </button>
            </div>

            {/* Compact Ratings Badge */}
            <div className="flex items-center gap-3 mt-6 relative z-10">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-white shadow-sm bg-gradient-to-br ${i === 1 ? 'from-blue-400 to-blue-600' :
                    i === 2 ? 'from-purple-400 to-purple-600' :
                      'from-pink-400 to-pink-600'
                    }`}></div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm">
                  +2k
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-sm">
                <span className="font-bold text-gray-900">4.9/5</span>
                <span className="text-gray-500 ml-1">· 2000+ customers</span>
              </div>
            </div>
          </div>

          {/* Block 2: Rotating Product Cards */}
          <RotatingProductCard />







        </div>
      </div>
    </div>
  );
};

export default Hero;
