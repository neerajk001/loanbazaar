'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const InsuranceProducts = () => {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);

  const products = [
    {
      id: 'health-insurance',
      title: 'Health Insurance',
      subtitle: 'Up to ₹1Cr cover',
      tag: 'Cashless',
      iconPath: '/card-logo/HealthInsurance.png',
      applyHref: '/apply-insurance?type=health',
      detailsHref: '/insurance/health-insurance',
      color: 'rose',
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      tagBg: 'bg-rose-100'
    },
    {
      id: 'term-life-insurance',
      title: 'Term Life',
      subtitle: 'Tax benefits 80C',
      tag: '₹10Cr+',
      iconPath: '/card-logo/terminsurance.png',
      applyHref: '/apply-insurance?type=term-life',
      detailsHref: '/insurance/term-life-insurance',
      color: 'blue',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      tagBg: 'bg-blue-100'
    },
    {
      id: 'car-insurance',
      title: 'Car Insurance',
      subtitle: 'Instant policy',
      tag: 'Zero Dep',
      iconPath: '/card-logo/CarInsurance.png',
      applyHref: '/apply-insurance?type=car',
      detailsHref: '/insurance/car-insurance',
      color: 'green',
      bg: 'bg-green-50',
      text: 'text-green-600',
      tagBg: 'bg-green-100'
    },
    {
      id: 'bike-insurance',
      title: 'Bike Insurance',
      subtitle: 'Third party',
      tag: 'Comprehensive',
      iconPath: '/card-logo/BikeInsurance.png',
      applyHref: '/apply-insurance?type=bike',
      detailsHref: '/insurance/bike-insurance',
      color: 'orange',
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      tagBg: 'bg-orange-100'
    },
    {
      id: 'loan-protector',
      title: 'Loan Protector',
      subtitle: 'Protect your loan',
      tag: 'Secure',
      iconPath: '/card-logo/LoanProtector.png',
      applyHref: '/apply-insurance?type=loan-protector',
      detailsHref: '/insurance/loan-protector',
      color: 'purple',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      tagBg: 'bg-purple-100'
    },
    {
      id: 'emi-protector',
      title: 'EMI Protector',
      subtitle: 'EMI protection',
      tag: 'Coverage',
      iconPath: '/card-logo/EMI Protector.png',
      applyHref: '/apply-insurance?type=emi-protector',
      detailsHref: '/insurance/emi-protector',
      color: 'indigo',
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      tagBg: 'bg-indigo-100'
    },
  ];

  const handleCardClick = (e: React.MouseEvent, href: string) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    router.push(href);
  };

  return (
    <div id="insurance" className="py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-6 pl-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Insurance
          </h1>
          <h2 className="text-xl font-bold text-gray-900">
            Comprehensive protection for you and your family
          </h2>
        </div>

        {/* First 3 static products */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.slice(0, 3).map((product) => (
            <div
              key={product.id}
              onClick={(e) => handleCardClick(e, product.detailsHref)}
              className={`group flex flex-col items-start text-left p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer relative border bg-white h-full min-h-[180px] ${product.color === 'blue' ? 'border-blue-100' :
                product.color === 'green' ? 'border-green-100' :
                  product.color === 'orange' ? 'border-orange-100' :
                    product.color === 'purple' ? 'border-purple-100' :
                      product.color === 'indigo' ? 'border-indigo-100' :
                        'border-rose-100'
                }`}
            >
              {/* Icon - Top Right Absolute */}
              <div className="absolute top-4 right-4 w-8 h-8 opacity-80 group-hover:scale-110 transition-transform duration-300">
                <Image
                  src={product.iconPath}
                  alt={product.title}
                  width={32}
                  height={32}
                  className="object-contain w-full h-full"
                />
              </div>

              {/* Tag */}
              <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-2 inline-block ${product.color === 'blue' ? 'bg-blue-50 text-blue-700' :
                product.color === 'green' ? 'bg-green-50 text-green-700' :
                  product.color === 'orange' ? 'bg-orange-50 text-orange-700' :
                    product.color === 'purple' ? 'bg-purple-50 text-purple-700' :
                      product.color === 'indigo' ? 'bg-indigo-50 text-indigo-700' :
                        'bg-rose-50 text-rose-700'
                }`}>
                {product.tag}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 mb-0.5 pr-8">
                {product.title}
              </h3>

              {/* Subtitle */}
              <p className="text-xs text-gray-500 mb-3 font-medium">
                {product.subtitle}
              </p>

              {/* Apply Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(product.applyHref);
                }}
                className="mt-auto bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-md shadow-blue-100"
              >
                Apply <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Expandable Section */}
        <div className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${showAll ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
              {products.slice(3).map((product) => (
                <div
                  key={product.id}
                  onClick={(e) => handleCardClick(e, product.detailsHref)}
                  className={`group flex flex-col items-start text-left p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer relative border bg-white h-full min-h-[180px] ${product.color === 'blue' ? 'border-blue-100' :
                    product.color === 'green' ? 'border-green-100' :
                      product.color === 'orange' ? 'border-orange-100' :
                        product.color === 'purple' ? 'border-purple-100' :
                          product.color === 'indigo' ? 'border-indigo-100' :
                            'border-rose-100'
                    }`}
                >
                  {/* Icon - Top Right Absolute */}
                  <div className="absolute top-4 right-4 w-8 h-8 opacity-80 group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src={product.iconPath}
                      alt={product.title}
                      width={32}
                      height={32}
                      className="object-contain w-full h-full"
                    />
                  </div>

                  {/* Tag */}
                  <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-2 inline-block ${product.color === 'blue' ? 'bg-blue-50 text-blue-700' :
                    product.color === 'green' ? 'bg-green-50 text-green-700' :
                      product.color === 'orange' ? 'bg-orange-50 text-orange-700' :
                        product.color === 'purple' ? 'bg-purple-50 text-purple-700' :
                          product.color === 'indigo' ? 'bg-indigo-50 text-indigo-700' :
                            'bg-rose-50 text-rose-700'
                    }`}>
                    {product.tag}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-0.5 pr-8">
                    {product.title}
                  </h3>

                  {/* Subtitle */}
                  <p className="text-xs text-gray-500 mb-3 font-medium">
                    {product.subtitle}
                  </p>

                  {/* Apply Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(product.applyHref);
                    }}
                    className="mt-auto bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-md shadow-blue-100"
                  >
                    Apply <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-all"
          >
            {showAll ? 'Show Less Insurance' : 'View All Insurance'}
            {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsuranceProducts;


