'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, ShieldCheck, Clock, BadgeCheck, ArrowRight } from 'lucide-react';

// Mock data for insurance product details
const insuranceDetails: Record<string, any> = {
  'health-insurance': {
    title: 'Health Insurance',
    heroImage: '/insurance/health.png',
    description: 'Secure your family’s health with our comprehensive health insurance plans. Get cashless treatment at top hospitals and coverage for pre & post-hospitalization expenses.',
    features: [
      'Cashless treatment at 10,000+ hospitals',
      'Coverage up to ₹1 Crore',
      'Pre & Post hospitalization cover',
      'Annual health check-ups',
      'No Claim Bonus benefits',
      'Tax benefits under Section 80D'
    ],
    eligibility: [
      'Age: 18 years to 65 years (for Proposer)',
      'Children: 91 days to 25 years',
      'Citizenship: Indian Resident',
      'Medical Test: May be required for 45+ years'
    ],
    documents: [
      'KYC Documents (PAN/Aadhaar)',
      'Address Proof',
      'Passport size photograph',
      'Medical reports (if applicable)'
    ],
    applyLink: '/apply-insurance?type=health'
  },
  'term-life-insurance': {
    title: 'Term Life Insurance',
    heroImage: '/insurance/term_life.png',
    description: 'Ensure your family’s financial security with our pure protection term insurance plans. High life cover at affordable premiums with tax saving benefits.',
    features: [
      'Life cover up to ₹10 Crores+',
      'Low premium rates starting @ ₹500/month',
      'Critical illness rider available',
      'Accidental death benefit option',
      'Tax benefits under Section 80C',
      'Claim settlement ratio > 98%'
    ],
    eligibility: [
      'Age: 18 to 65 years',
      'Income: Salaried or Self-Employed',
      'Min. Income: ₹3 Lakhs p.a.',
      'Citizenship: Indian Resident / NRI'
    ],
    documents: [
      'Identity & Address Proof',
      'Income Proof (Salary Slip/ITR)',
      'Bank Statement',
      'Medical Check-up (if required)'
    ],
    applyLink: '/apply-insurance?type=term-life'
  },
  'car-insurance': {
    title: 'Car Insurance',
    heroImage: '/insurance/car.png',
    description: 'Protect your car against accidents, theft, and natural calamities. Choose from Comprehensive, Third-Party, or Zero Depreciation plans.',
    features: [
      'Zero Depreciation Cover',
      '24x7 Roadside Assistance',
      'Cashless repairs at network garages',
      'Instant policy issuance',
      'No Claim Bonus (NCB) transfer',
      'Engine protection add-on available'
    ],
    eligibility: [
      'Vehicle Registration Certificate (RC)',
      'Valid Driving License',
      'Previous Policy (for renewal)',
      'Vehicle Inspection (for break-in cases)'
    ],
    documents: [
      'RC Copy',
      'Previous Insurance Policy',
      'KYC of Owner'
    ],
    applyLink: '/apply-insurance?type=car'
  },
  'bike-insurance': {
    title: 'Bike Insurance',
    heroImage: '/insurance/bike.png',
    description: 'Ride with confidence. Get comprehensive two-wheeler insurance covering damage, theft, and third-party liability at best premiums.',
    features: [
      'Comprehensive & Third-Party plans',
      'Instant policy renewal',
      'Cashless claims at network garages',
      'Personal Accident Cover of ₹15 Lakhs',
      'No inspection for expired policy renewal',
      'Add-ons like Zero Dep, Return to Invoice'
    ],
    eligibility: [
      'Vehicle RC',
      'Valid Driving License',
      'Previous Policy Details'
    ],
    documents: [
      'RC Copy',
      'Previous Policy Copy',
      'KYC Documents'
    ],
    applyLink: '/apply-insurance?type=bike'
  },
  'loan-protector': {
    title: 'Loan Protector',
    heroImage: '/insurance/health.png',
    description: 'Protect your loan and secure your family\'s financial future. Loan Protector insurance ensures your loan is paid off in case of unforeseen circumstances, giving you and your family peace of mind.',
    features: [
      'Complete loan balance coverage',
      'Coverage for Personal, Business, and Home Loans',
      'Affordable premium rates',
      'No medical tests required (up to certain limits)',
      'Tax benefits under Section 80C',
      'Easy claim settlement process'
    ],
    eligibility: [
      'Age: 18 years to 65 years',
      'Active loan account required',
      'Loan amount: ₹1 Lakh to ₹5 Crores',
      'Loan tenure: Minimum 1 year',
      'Citizenship: Indian Resident'
    ],
    documents: [
      'KYC Documents (PAN/Aadhaar)',
      'Loan Agreement Copy',
      'Loan Statement',
      'Address Proof',
      'Passport size photograph'
    ],
    applyLink: '/apply-insurance?type=loan-protector'
  },
  'emi-protector': {
    title: 'EMI Protector',
    heroImage: '/insurance/health.png',
    description: 'Safeguard your EMI payments with comprehensive protection. EMI Protector ensures your loan EMIs are covered in case of job loss, disability, or critical illness, keeping your financial commitments secure.',
    features: [
      'EMI coverage during job loss',
      'Disability benefit coverage',
      'Critical illness protection',
      'Coverage for Personal, Business, and Home Loans',
      'Flexible coverage options',
      'Quick claim processing'
    ],
    eligibility: [
      'Age: 18 years to 60 years',
      'Active loan with regular EMI payments',
      'Loan amount: ₹50,000 to ₹2 Crores',
      'Employment: Salaried or Self-Employed',
      'Minimum income: ₹25,000 per month'
    ],
    documents: [
      'KYC Documents (PAN/Aadhaar)',
      'Loan Agreement Copy',
      'EMI Payment Statement',
      'Income Proof (Salary Slip/ITR)',
      'Bank Statement',
      'Passport size photograph'
    ],
    applyLink: '/apply-insurance?type=emi-protector'
  }
};

export default function InsuranceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = insuranceDetails[slug];

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Insurance Product Not Found</h1>
          <Link href="/" className="text-blue-600 hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Full-width blue banner with product name and back button */}
      <div className="bg-blue-900 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/" className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-2.5 rounded-lg mb-4 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mt-4">{product.title}</h1>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Features */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Eligibility */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BadgeCheck className="w-6 h-6 text-orange-600" />
                Eligibility / Requirements
              </h2>
              <ul className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 space-y-4 shadow-sm">
                {product.eligibility.map((item: string, index: number) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* Documents */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-green-600" />
                Documents Required
              </h2>
              <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.documents.map((doc: string, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-gray-600 font-bold text-sm border border-gray-100">
                        {index + 1}
                      </div>
                      <span className="text-gray-700 font-medium">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar CTA */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Get Insured Now</h3>
              <p className="text-gray-500 text-sm mb-6">Protect what matters most in 4 simple steps.</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">1</div>
                  <span className="text-sm font-medium text-gray-600">Fill The Form</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">2</div>
                  <span className="text-sm font-medium text-gray-600">Get The Quote</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">3</div>
                  <span className="text-sm font-medium text-gray-600">Login</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">4</div>
                  <span className="text-sm font-medium text-gray-600">Policy Issued</span>
                </div>
              </div>

              <Link 
                href={product.applyLink}
                className="block w-full bg-orange-600 text-white text-center font-bold py-4 rounded-xl hover:bg-orange-700 transition-colors shadow-lg hover:shadow-orange-200 mb-4 flex items-center justify-center gap-2"
              >
                Get Quote <ArrowRight className="w-5 h-5" />
              </Link>
              
              <p className="text-xs text-center text-gray-400">
                T&C Apply. Insurance is a subject matter of solicitation.
              </p>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}

