'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Phone, Star, ArrowRight, TrendingUp, Zap, Home as HomeIcon, Briefcase, GraduationCap, Shield as ShieldIcon, Car } from 'lucide-react';


const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    '/hero-slides/slide1.png',
    '/hero-slides/slide2.png',
    '/hero-slides/slide3.png'
  ];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // 4 seconds per slide
    return () => clearInterval(slideInterval);
  }, [slides.length]);

  return (
    <div className="bg-slate-50/50 py-12 lg:py-20 overflow-hidden relative">
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
                href="tel:+919870802207"
                className="flex items-center justify-center gap-2 w-full bg-green-700 text-white font-bold py-3.5 rounded-xl hover:bg-green-800 transition-colors shadow-lg shadow-green-200 mb-3"
              >
                <Phone className="h-5 w-5" />
                Call +91 98708 02207
              </a>

              <p className="text-xs text-gray-400">
                Standard calling charges may apply
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full">

          {/* Main Hero Copy - Now Full Width */}
          <div className="w-full bg-slate-900 rounded-[2.5rem] p-8 lg:p-14 shadow-2xl border border-blue-800/60 flex flex-col justify-center items-start relative overflow-hidden min-h-[450px]">
            {/* Sliding Background Images (right side) */}
            <div className="absolute inset-y-0 right-0 w-full sm:w-4/5 md:w-3/4 lg:w-3/5 transition-opacity duration-1000">
              {slides.map((slide, index) => (
                <img
                  key={slide}
                  src={slide}
                  alt={`Hero Background ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                    index === currentSlide ? 'opacity-80' : 'opacity-0'
                  }`}
                  style={{
                    maskImage: 'linear-gradient(to right, transparent, black 35%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent, black 35%)'
                  }}
                />
              ))}
            </div>
            
            {/* Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 sm:via-slate-900/70 to-transparent pointer-events-none z-0"></div>

            <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-bold text-white leading-[1.1] mb-6 relative z-10 tracking-tight">
              Get the Best Loan Deals, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">Faster & Easier</span>
            </h1>

            <p className="text-lg lg:text-xl text-blue-100/90 mb-10 max-w-xl leading-relaxed relative z-10">
              We connect you with top financial institutions to secure the lowest interest rates. Enjoy minimal documentation, transparent terms, and lightning-fast approvals.
            </p>

            <div className="flex flex-wrap items-center gap-4 relative z-10 w-full sm:w-auto">
              <Link href="/apply" className="w-full sm:w-auto bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-400 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] hover:-translate-y-1 flex items-center justify-center gap-2 group">
                Get Started Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-white bg-white/5 border-2 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center backdrop-blur-sm active:scale-95">
                Talk to Expert
              </button>
            </div>

            {/* Compact Ratings Badge */}
            <div className="flex flex-wrap items-center gap-3 mt-8 relative z-10">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 border-blue-900 shadow-sm bg-gradient-to-br ${i === 1 ? 'from-blue-400 to-blue-600' :
                    i === 2 ? 'from-indigo-400 to-indigo-600' :
                      'from-emerald-400 to-emerald-600'
                    }`}></div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-blue-900 bg-white/10 backdrop-blur-md flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  +5k
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-sm ml-1">
                <span className="font-bold text-white">4.9/5</span>
                <span className="text-blue-200/70 ml-1">· 5000+ happy customers</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Hero;
