'use client';
import React from 'react';
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
    heroImage: 'https://images.unsplash.com/photo-1664575602554-2087b04935a5?auto=format&fit=crop&q=80&w=2000',
    description: 'Fuel your business growth with our collateral-free business loans. Designed for Proprietorships, Partnerships, Pvt Ltd, and LLPs to manage working capital, expansion, or equipment purchase.',
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
    heroImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=2000',
    description: 'Make your dream home a reality with our affordable home loans. We cover New Purchases, Resale Properties, Construction, and Plot Purchases.',
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
    heroImage: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80&w=2000',
    description: 'Unlock the hidden value of your property to meet your high-value financial needs. We accept Residential, Commercial, Industrial properties and Plots.',
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
  'credit-card': {
    title: 'Credit Cards',
    heroImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=2000',
    description: 'Choose from a wide range of credit cards offering exclusive rewards, cashback, lounge access, and lifetime free options tailored to your spending habits.',
    features: [
      'Lifetime Free options available',
      'Welcome rewards & cashback on spend',
      'Airport lounge access (Domestic & International)',
      'Fuel surcharge waivers',
      'Contactless payments & EMI conversion',
      'Insurance coverage (Air Accident/Lost Card)'
    ],
    eligibility: [
      'Employment: Salaried or Self-Employed',
      'Min. Monthly Income: ₹20,000 (vary by card type)',
      'CIBIL Score: 750+ (High importance)',
      'Age: 21 to 60 years',
      'Existing Credit Card holders get faster approval'
    ],
    documents: [
      'Identity Proof (PAN/Aadhaar)',
      'Address Proof (Aadhaar/Passport/Voter ID)',
      'Income Proof: Latest Salary Slip or ITR',
      'Passport Size Photograph',
      'Existing Credit Card Statement (if applying Card-to-Card)'
    ],
    applyLink: '/apply?type=cc'
  }
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = productDetails[slug];

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link href="/products" className="text-blue-600 hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[400px] w-full">
        <div className="absolute inset-0">
          <img 
            src={product.heroImage} 
            alt={product.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12">
          <Link href="/products" className="text-white/80 hover:text-white flex items-center gap-2 mb-6 w-fit bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to all products
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{product.title}</h1>
          <p className="text-lg text-gray-200 max-w-2xl">{product.description}</p>
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
              <p className="text-gray-500 text-sm mb-6">Get your {product.title.toLowerCase()} approved in 3 easy steps.</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">1</div>
                  <span className="text-sm font-medium text-gray-600">Fill Application</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">2</div>
                  <span className="text-sm font-medium text-gray-600">Upload Documents</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">3</div>
                  <span className="text-sm font-medium text-gray-600">Get Disbursal</span>
                </div>
              </div>

              <Link 
                href={product.applyLink}
                className="block w-full bg-orange-600 text-white text-center font-bold py-4 rounded-xl hover:bg-orange-700 transition-colors shadow-lg hover:shadow-orange-200 mb-4 flex items-center justify-center gap-2"
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
