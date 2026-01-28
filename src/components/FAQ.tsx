'use client';
import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Search, Sparkles } from 'lucide-react';

const FAQ = () => {
  const categories = [
    { id: 'all', label: 'All Questions', icon: Sparkles },
    { id: 'process', label: 'Process', icon: HelpCircle },
    { id: 'documents', label: 'Documents', icon: HelpCircle },
    { id: 'charges', label: 'Charges', icon: HelpCircle },
  ];

  const faqs = [
    {
      id: 1,
      question: 'What documents are required for a personal loan?',
      answer: 'Typically, you need identity proof (Aadhaar/PAN), address proof, income proof (salary slips or ITR), and bank statements for the last 6 months. Requirements may vary slightly between lenders.',
      category: 'documents',
    },
    {
      id: 2,
      question: 'How long does the loan approval process take?',
      answer: 'With Loanbazaar, we aim for the fastest turnaround. Personal loans can be approved in as little as 24 hours, while home loans and business loans usually take 3-7 working days depending on documentation.',
      category: 'process',
    },
    {
      id: 3,
      question: 'Is my credit score important for loan approval?',
      answer: 'Yes, your credit score (CIBIL) plays a crucial role. A score of 750+ is generally considered good and can help you get lower interest rates. However, we also work with partners who support applicants with lower scores.',
      category: 'process',
    },
    {
      id: 4,
      question: 'Are there any hidden charges?',
      answer: 'Transparency is our core value. All charges like processing fees, insurance (if opted), and government levies are clearly communicated to you before you sign the loan agreement.',
      category: 'charges',
    },
    {
      id: 5,
      question: 'Can I prepay my loan before the tenure ends?',
      answer: 'Most banks allow prepayment after a certain lock-in period (usually 6-12 months). Some may charge a small prepayment penalty, while others offer it for free. We help you choose lenders with favorable prepayment terms.',
      category: 'charges',
    },
    {
      id: 6,
      question: 'What is the minimum and maximum loan amount I can apply for?',
      answer: 'Personal loans range from ₹50,000 to ₹40 lakhs. Home loans can go up to ₹5 crores, and business loans vary based on your turnover and business profile. Contact us for specific requirements.',
      category: 'process',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && (searchQuery === '' || matchesSearch);
  });

  return (
    <div className="py-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-0 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-72 h-72 bg-indigo-100/40 rounded-full blur-3xl" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Everything you need to know about getting a loan with us
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search your question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 ${
                activeCategory === cat.id
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <div 
              key={faq.id} 
              className={`bg-gradient-to-br from-white to-blue-50/20 border-2 ${
                openIndex === index ? 'border-blue-300 shadow-xl' : 'border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-200'
              } rounded-2xl overflow-hidden transition-all duration-300`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none group"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    openIndex === index ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600'
                  }`}>
                    <span className="font-bold text-sm">{String(index + 1).padStart(2, '0')}</span>
                  </div>
                  <span className={`font-semibold text-lg transition-colors ${
                    openIndex === index ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'
                  }`}>
                    {faq.question}
                  </span>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ml-4 transition-all duration-300 ${
                  openIndex === index 
                    ? 'bg-blue-600 text-white rotate-180' 
                    : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                }`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>
              
              <div 
                className={`grid transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6 pt-0">
                    <div className="pl-12 text-gray-600 leading-relaxed border-l-2 border-blue-200 ml-4">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-500">Try a different search term or category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FAQ;
