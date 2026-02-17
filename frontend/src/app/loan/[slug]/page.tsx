'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, ShieldCheck, Clock, BadgeCheck, ArrowRight } from 'lucide-react';

// Mock data for product details - aligned with ApplicationForm requirements
const productDetails: Record<string, any> = {
  'personal-loan': {
    title: 'Personal Loan',
    heroImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2000',
    description: 'Get instant funds for your personal needs with minimal documentation. Whether it is a medical emergency, wedding expenses, or travel plans, our personal loans offer flexible repayment options.',
    maxAmount: 'Loans up to ₹50 Lakhs',
    interestRate: 'Interest rates starting @ 10.49% p.a.',
    features: [
      'Loans up to ₹50 Lakhs',
      'Interest rates starting @ 10.49% p.a.',
      'Flexible tenure up to 60 months',
      'For Salaried & Self-Employed Professionals',
      'Quick disbursal within 24 hours',
      'No collateral required'
    ],
    eligibility: [
      'Citizenship: Indian Resident',
      'Age: 21 to 60 years',
      'Employment: Salaried (MNC/Pvt Ltd/Govt) or Self-Employed',
      'Min. Monthly Income: ₹25,000 (Salaried)',
      'CIBIL Score: 700+ preferred',
      'Work Experience: Min. 2 years total, 1 year in current org'
    ],
    documents: [
      'Identity Proof (PAN Card/Aadhaar)',
      'Address Proof (Aadhaar/Passport/Utility Bill)',
      'Income Proof: Last 3 months Salary Slips',
      'Bank Statements: Last 6 months',
      'Employment Proof: Company ID Card / Appointment Letter'
    ],
    applyLink: '/apply?type=personal'
  },
  'business-loan': {
    title: 'Business Loan',
    heroImage: '/loan/business.png',
    description: 'Fuel your business growth with our collateral-free business loans. Designed for Proprietorships, Partnerships, Pvt Ltd, and LLPs to manage working capital, expansion, or equipment purchase.',
    maxAmount: 'Loans up to ₹2 Crores',
    interestRate: 'Interest rates starting @ 14.00% p.a.',
    features: [
      'Loans up to ₹2 Crores (Collateral-free)',
      'Supports Proprietorship, Partnership, Pvt Ltd, & LLP',
      'Flexible repayment terms up to 60 months',
      'Fast-track processing with minimal paperwork',
      'Balance transfer & Top-up facility available'
    ],
    eligibility: [
      'Business Vintage: Minimum 3 years in operation',
      'Annual Turnover: Minimum ₹40 Lakhs',
      'Profitability: Profitable for last 2 years',
      'GST Registration: Mandatory',
      'Age: 24 to 65 years',
      'CIBIL Score: 700+ for main applicants'
    ],
    documents: [
      'KYC of all applicants/co-applicants',
      'Business Registration Proof (GST Certificate/Udyam)',
      'Last 2 years ITR with Computation & Financials (Audited)',
      'GST Returns (Last 12 months)',
      'Bank Statements (Last 6 months - Current Account)',
      'Ownership Proof of Residence or Office'
    ],
    applyLink: '/apply?type=business'
  },
  'home-loan': {
    title: 'Home Loan',
    heroImage: '/loan/home.png',
    description: 'Make your dream home a reality with our affordable home loans. We cover New Purchases, Resale Properties, Construction, and Plot Purchases.',
    maxAmount: 'Loans up to ₹5 Crores',
    interestRate: 'Low interest rates starting @ 7.15% p.a.',
    features: [
      'Loans up to ₹5 Crores',
      'Low interest rates starting @ 8.50% p.a.',
      'Tenure up to 30 years',
      'Covers: New Purchase, Resale, Construction, & Plots',
      'Balance Transfer with Top-up available',
      'PMAY subsidy benefits for eligible applicants'
    ],
    eligibility: [
      'Citizenship: Indian Resident',
      'Age: 21 to 65 years',
      'Employment: Salaried or Self-Employed',
      'Min. Monthly Income: ₹30,000',
      'CIBIL Score: 750+ for best rates',
      'Property Status: Ready to Move or Under Construction'
    ],
    documents: [
      'KYC Documents (PAN/Aadhaar)',
      'Income Proof (Salary Slips/ITR)',
      'Bank Statements (Last 6 months)',
      'Property Documents: Sale Agreement/Index II',
      'Sanction Plan & OC/CC (for Under Construction)',
      'Processing Fee Cheque'
    ],
    applyLink: '/apply?type=home'
  },
  'loan-against-property': {
    title: 'Loan Against Property',
    heroImage: '/loan/property.png',
    description: 'Unlock the hidden value of your property to meet your high-value financial needs. We accept Residential, Commercial, Industrial properties and Plots.',
    maxAmount: 'Loans up to 70%',
    interestRate: 'Interest rates starting @ 8.75% p.a.',
    features: [
      'High loan amount sanctions (up to 70% of Market Value)',
      'Accepts: Residential, Commercial, Industrial, & Plots',
      'Occupancy: Self-Occupied, Rented, or Vacant accepted',
      'Lower interest rates compared to Personal Loans',
      'Longer repayment tenure up to 15 years',
      'Overdraft (OD) facility available'
    ],
    eligibility: [
      'Property Ownership: Must be owned by applicant(s)',
      'Property Title: Clear and marketable title',
      'Employment: Salaried or Self-Employed',
      'Min. Income: As per lender norms',
      'Age: 25 to 65 years'
    ],
    documents: [
      'KYC Documents (PAN/Aadhaar)',
      'Original Property Title Deeds & Chain Documents',
      'Income Proof (ITR/Salary Slips)',
      'Bank Statements (Last 6 months)',
      'Property Tax Receipts / Electricity Bill'
    ],
    applyLink: '/apply?type=lap'
  },
  'education-loan': {
    title: 'Education Loan',
    heroImage: '/loan/education.png',
    description: 'Invest in your future with our comprehensive education loans. Cover tuition fees, living expenses, and other educational costs for studies in India or abroad.',
    maxAmount: 'Loans up to ₹2 Crores',
    interestRate: 'Interest rates starting @ 9.50% p.a.',
    features: [
      'Loans up to ₹1.5 Crores for abroad studies',
      'Covers tuition fees, living expenses & travel',
      'Moratorium period during course duration',
      'Tax benefits under Section 80E',
      'No collateral required for loans up to ₹7.5 Lakhs',
      'Competitive interest rates starting @ 8.50% p.a.'
    ],
    eligibility: [
      'Student Age: 16 to 35 years',
      'Course: Recognized institutions in India/Abroad',
      'Co-applicant: Parent/Guardian required',
      'Co-applicant Income: Minimum ₹25,000/month',
      'CIBIL Score: 700+ for co-applicant',
      'Admission: Confirmed admission letter required'
    ],
    documents: [
      'Student & Co-applicant KYC (PAN/Aadhaar)',
      'Admission Letter from recognized institution',
      'Course Fee Structure & Schedule',
      'Co-applicant Income Proof (Salary Slips/ITR)',
      'Bank Statements (Last 6 months)',
      'Academic Records (10th, 12th, Graduation marksheets)'
    ],
    applyLink: '/apply?type=education'
  },
  'car-loan': {
    title: 'Car Loan',
    heroImage: '/loan/car.png',
    description: 'Drive your dream car home with our flexible car loans. We offer financing for new cars, used cars, and pre-owned vehicles with competitive interest rates and flexible tenure options.',
    maxAmount: 'Loans up to 90%',
    interestRate: 'Interest rates starting @ 8.50% p.a.',
    features: [
      'Loans up to 90% of car value (On-Road Price)',
      'Interest rates starting @ 8.50% p.a.',
      'Flexible tenure up to 7 years',
      'Covers: New Cars & Used Cars (up to 7 years old)',
      'Quick approval and fast disbursal',
      'Zero foreclosure charges after 6 months'
    ],
    eligibility: [
      'Citizenship: Indian Resident',
      'Age: 21 to 65 years',
      'Employment: Salaried or Self-Employed',
      'Min. Monthly Income: ₹25,000 (Salaried) / ₹50,000 (Self-Employed)',
      'CIBIL Score: 700+ for best rates',
      'Existing loans: Should not exceed 50% of net income'
    ],
    documents: [
      'Identity Proof (PAN Card/Aadhaar)',
      'Address Proof (Aadhaar/Passport/Utility Bill)',
      'Income Proof: Last 3 months Salary Slips (Salaried) / Last 2 years ITR (Self-Employed)',
      'Bank Statements (Last 6 months)',
      'Car Quotation/Proforma Invoice',
      'Existing Loan Statements (if any)',
      'Passport size photographs'
    ],
    applyLink: '/apply?type=car'
  }
};

export default function LoanDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = productDetails[slug];
  const [loanProductData, setLoanProductData] = useState<{
    maxAmount: string;
    interestRate: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoanProduct = async () => {
      try {
        const response = await fetch(`/api/loan-products?slug=${slug}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.product) {
            setLoanProductData(data.product);
          }
        }
      } catch (error) {
        console.error('Error fetching loan product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchLoanProduct();
    }
  }, [slug]);

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loan Not Found</h1>
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
                {/* First two cards with blue circular icons */}
                <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    {loading ? 'Loading...' : (loanProductData?.maxAmount || product.maxAmount)}
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">
                    {loading ? 'Loading...' : (loanProductData?.interestRate || product.interestRate)}
                  </span>
                </div>
                {/* Remaining features as regular cards */}
                {product.features.slice(2).map((feature: string, index: number) => (
                  <div key={index + 2} className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl">
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
                Eligibility Criteria
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
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Apply?</h3>
              <p className="text-gray-500 text-sm mb-6">Get your {product.title.toLowerCase()} approved in 4 easy steps.</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">1</div>
                  <span className="text-sm font-medium text-gray-600">Fill The Form</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">2</div>
                  <span className="text-sm font-medium text-gray-600">Login</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">3</div>
                  <span className="text-sm font-medium text-gray-600">Approval</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">4</div>
                  <span className="text-sm font-medium text-gray-600">Disbursement</span>
                </div>
              </div>

              <Link 
                href={product.applyLink}
                className="flex w-full bg-orange-600 text-white text-center font-bold py-4 rounded-xl hover:bg-orange-700 transition-colors shadow-lg hover:shadow-orange-200 mb-4 items-center justify-center gap-2"
              >
                Apply Now <ArrowRight className="w-5 h-5" />
              </Link>
              
              <p className="text-xs text-center text-gray-400">
                By applying, you agree to our terms and conditions.
              </p>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}

