'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Products = () => {
  const router = useRouter();
  const [loanProductsData, setLoanProductsData] = useState<Record<string, { maxAmount: string; interestRate: string }>>({});
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchLoanProducts = async () => {
      try {
        const response = await fetch('/api/loan-products');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.products) {
            // Convert array to object keyed by slug for easy lookup
            const productsMap: Record<string, { maxAmount: string; interestRate: string }> = {};
            data.products.forEach((product: any) => {
              productsMap[product.slug] = {
                maxAmount: product.maxAmount,
                interestRate: product.interestRate,
              };
            });
            setLoanProductsData(productsMap);
          }
        }
      } catch (error) {
        console.error('Error fetching loan products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoanProducts();
  }, []);

  // Helper function to extract ROI percentage from interest rate string
  const extractROI = (interestRate: string): string => {
    const match = interestRate.match(/@(\d+\.?\d*)%/);
    if (match) {
      return `@${match[1]}% ROI`;
    }
    // Fallback: try to find any percentage
    const fallbackMatch = interestRate.match(/(\d+\.?\d*)%/);
    if (fallbackMatch) {
      return `@${fallbackMatch[1]}% ROI`;
    }
    return interestRate; // Return as-is if no percentage found
  };

  // Helper function to extract max amount from maxAmount string
  const extractMaxAmount = (maxAmount: string): string => {
    // If it already starts with "Up to" or similar, return as-is
    if (maxAmount.toLowerCase().includes('up to') || maxAmount.toLowerCase().includes('upto')) {
      return maxAmount;
    }
    // Otherwise, add "Up to" prefix
    return maxAmount.startsWith('Loans up to') ? maxAmount.replace('Loans up to', 'Up to') : `Up to ${maxAmount}`;
  };

  const products = [
    {
      id: 'personal-loan',
      slug: 'personal-loan',
      title: 'Personal Loan',
      defaultSubtitle: 'Up to ₹50 Lakhs',
      defaultTag: '@10.49% ROI',
      iconPath: '/card-logo/PersonalLoan.png',
      applyHref: '/apply?type=personal',
      detailsHref: '/loan/personal-loan',
      color: 'blue',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      tagBg: 'bg-blue-100'
    },
    {
      id: 'business-loan',
      slug: 'business-loan',
      title: 'Business Loan',
      defaultSubtitle: 'Up to ₹2 Crores',
      defaultTag: '@14.00% ROI',
      iconPath: '/card-logo/BusinessLoan.png',
      applyHref: '/apply?type=business',
      detailsHref: '/loan/business-loan',
      color: 'purple',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
      tagBg: 'bg-purple-100'
    },
    {
      id: 'home-loan',
      slug: 'home-loan',
      title: 'Home Loan',
      defaultSubtitle: 'Up to ₹5 Crores',
      defaultTag: '@7.15% ROI',
      iconPath: '/card-logo/HomeLoan (2).png',
      applyHref: '/apply?type=home',
      detailsHref: '/loan/home-loan',
      color: 'green',
      bg: 'bg-green-50',
      text: 'text-green-600',
      tagBg: 'bg-green-100'
    },
    {
      id: 'loan-against-property',
      slug: 'loan-against-property',
      title: 'Mortgage Loan',
      defaultSubtitle: 'Up to 70%',
      defaultTag: '@8.75% ROI',
      iconPath: '/card-logo/LAP (2).png',
      applyHref: '/apply?type=lap',
      detailsHref: '/loan/loan-against-property',
      color: 'orange',
      bg: 'bg-orange-50',
      text: 'text-orange-600',
      tagBg: 'bg-orange-100'
    },
    {
      id: 'education-loan',
      slug: 'education-loan',
      title: 'Education Loan',
      defaultSubtitle: 'Up to ₹2 Crores',
      defaultTag: '@9.50% ROI',
      iconPath: '/card-logo/EducationLoan.png',
      applyHref: '/apply?type=education',
      detailsHref: '/loan/education-loan',
      color: 'indigo',
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      tagBg: 'bg-indigo-100'
    },
    {
      id: 'car-loan',
      slug: 'car-loan',
      title: 'Car Loan',
      defaultSubtitle: 'Up to 90%',
      defaultTag: '@8.50% ROI',
      iconPath: '/card-logo/CarLoan (2).png',
      applyHref: '/apply?type=car',
      detailsHref: '/loan/car-loan',
      color: 'teal',
      bg: 'bg-teal-50',
      text: 'text-teal-600',
      tagBg: 'bg-teal-100'
    },
  ];

  const handleCardClick = (e: React.MouseEvent, href: string) => {
    // Prevent navigation if the click originated from the Apply button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    router.push(href);
  };

  return (
    <div id="products" className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-6 pl-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Loan
          </h1>
          <h2 className="text-xl font-bold text-gray-900">
            Choose from our wide range of loan products
          </h2>
        </div>

        {/* First 3 static products */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 3).map((product) => (
            <div
              key={product.id}
              onClick={(e) => handleCardClick(e, product.detailsHref)}
              className={`group flex flex-col items-start text-left p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer relative border bg-white h-full min-h-[180px] ${product.color === 'blue' ? 'border-blue-100' :
                  product.color === 'purple' ? 'border-purple-100' :
                    product.color === 'green' ? 'border-green-100' :
                      product.color === 'orange' ? 'border-orange-100' :
                        product.color === 'indigo' ? 'border-indigo-100' :
                          'border-teal-100'
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

              {/* Tag - Interest Rate (ROI) */}
              <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-2 inline-block ${product.color === 'blue' ? 'bg-blue-50 text-blue-700' :
                product.color === 'purple' ? 'bg-purple-50 text-purple-700' :
                  product.color === 'green' ? 'bg-green-50 text-green-700' :
                    product.color === 'orange' ? 'bg-orange-50 text-orange-700' :
                      product.color === 'indigo' ? 'bg-indigo-50 text-indigo-700' :
                        'bg-teal-50 text-teal-700'
                }`}>
                {loading ? '...' : (loanProductsData[product.slug]?.interestRate
                  ? extractROI(loanProductsData[product.slug].interestRate)
                  : product.defaultTag)}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 mb-0.5 pr-8">
                {product.title}
              </h3>

              {/* Subtitle - Maximum Amount */}
              <p className="text-xs text-gray-500 mb-3 font-medium">
                {loading ? '...' : (loanProductsData[product.slug]?.maxAmount
                  ? extractMaxAmount(loanProductsData[product.slug].maxAmount)
                  : product.defaultSubtitle)}
              </p>

              {/* Apply Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Stop bubble to parent div
                  router.push(product.applyHref);
                }}
                className="mt-auto bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-md shadow-blue-100"
              >
                Apply <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Expandable Section */}
        <div className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${showAll ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
              {products.slice(3).map((product) => (
                <div
                  key={product.id}
                  onClick={(e) => handleCardClick(e, product.detailsHref)}
                  className={`group flex flex-col items-start text-left p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer relative border bg-white h-full min-h-[180px] ${product.color === 'blue' ? 'border-blue-100' :
                      product.color === 'purple' ? 'border-purple-100' :
                        product.color === 'green' ? 'border-green-100' :
                          product.color === 'orange' ? 'border-orange-100' :
                            product.color === 'indigo' ? 'border-indigo-100' :
                              'border-teal-100'
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

                  {/* Tag - Interest Rate (ROI) */}
                  <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold mb-2 inline-block ${product.color === 'blue' ? 'bg-blue-50 text-blue-700' :
                    product.color === 'purple' ? 'bg-purple-50 text-purple-700' :
                      product.color === 'green' ? 'bg-green-50 text-green-700' :
                        product.color === 'orange' ? 'bg-orange-50 text-orange-700' :
                          product.color === 'indigo' ? 'bg-indigo-50 text-indigo-700' :
                            'bg-teal-50 text-teal-700'
                    }`}>
                    {loading ? '...' : (loanProductsData[product.slug]?.interestRate
                      ? extractROI(loanProductsData[product.slug].interestRate)
                      : product.defaultTag)}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-0.5 pr-8">
                    {product.title}
                  </h3>

                  {/* Subtitle - Maximum Amount */}
                  <p className="text-xs text-gray-500 mb-3 font-medium">
                    {loading ? '...' : (loanProductsData[product.slug]?.maxAmount
                      ? extractMaxAmount(loanProductsData[product.slug].maxAmount)
                      : product.defaultSubtitle)}
                  </p>

                  {/* Apply Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Stop bubble to parent div
                      router.push(product.applyHref);
                    }}
                    className="mt-auto bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-md shadow-blue-100"
                  >
                    Apply <ArrowRight className="w-3 h-3" />
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
            {showAll ? 'Show Less Products' : 'View All Products'}
            {showAll ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
