'use client';
import React, { useState } from 'react';
import { Plus, Minus, MessageCircle, ArrowRight } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What documents are required for a personal loan?',
      answer: 'Typically, you need identity proof (Aadhaar/PAN), address proof, income proof (salary slips or ITR), and bank statements for the last 6 months. Requirements may vary slightly between lenders.',
    },
    {
      question: 'How long does the loan approval process take?',
      answer: 'With Loanbazaar, we aim for the fastest turnaround. Personal loans can be approved in as little as 24 hours, while home loans and business loans usually take 3-7 working days depending on documentation.',
    },
    {
      question: 'Is my credit score important for loan approval?',
      answer: 'Yes, your credit score (CIBIL) plays a crucial role. A score of 750+ is generally considered good and can help you get lower interest rates. However, we also work with partners who support applicants with lower scores.',
    },
    {
      question: 'Are there any hidden charges?',
      answer: 'Transparency is our core value. All charges like processing fees, insurance (if opted), and government levies are clearly communicated to you before you sign the loan agreement.',
    },
    {
      question: 'Can I prepay my loan before the tenure ends?',
      answer: 'Most banks allow prepayment after a certain lock-in period (usually 6-12 months). Some may charge a small prepayment penalty, while others offer it for free. We help you choose lenders with favorable prepayment terms.',
    },
    {
      question: 'What is the minimum and maximum loan amount I can apply for?',
      answer: 'Personal loans range from ₹50,000 to ₹40 lakhs. Home loans can go up to ₹5 crores, and business loans vary based on your turnover and business profile. Contact us for specific requirements.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">

          {/* Left Column - Header & Contact */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-4 block">
                Support
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Frequently asked questions
              </h2>
              <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                Everything you need to know about our products and services. Can't find the answer you're looking for?
              </p>

              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 inline-block w-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Still have questions?</h4>
                    <p className="text-sm text-gray-500">We're here to help.</p>
                  </div>
                </div>
                <button className="w-full bg-gray-900 text-white font-semibold py-3 px-6 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                  Contact Support <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Accordion */}
          <div className="lg:col-span-7">
            <div className="bg-transparent space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`group border-b border-gray-200 last:border-0 pb-4 ${openIndex === index ? 'bg-gray-50/50 rounded-2xl border-none p-6 mb-4' : 'p-4 hover:bg-gray-50 rounded-2xl transition-colors'}`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="flex justify-between items-start w-full text-left focus:outline-none"
                  >
                    <span className={`text-lg font-semibold pr-8 transition-colors ${openIndex === index ? 'text-blue-600' : 'text-gray-900'}`}>
                      {faq.question}
                    </span>
                    <span className={`shrink-0 ml-4 p-1 rounded-full border transition-all duration-300 ${openIndex === index
                      ? 'bg-blue-600 border-blue-600 text-white rotate-180'
                      : 'bg-white border-gray-200 text-gray-400 group-hover:border-gray-300'
                      }`}>
                      {openIndex === index ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </span>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${openIndex === index ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'
                      }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FAQ;
