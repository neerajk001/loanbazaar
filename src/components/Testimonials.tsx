'use client';
import React, { useState, useRef } from 'react';
import { Star, TrendingUp, Clock, BadgeCheck, ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const testimonials = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      role: 'Small Business Owner',
      location: 'Mumbai',
      content: 'Loanbazaar helped me secure a business loan within 48 hours. The process was seamless and the interest rate was much lower than I expected. Highly recommended for any entrepreneur.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      loanType: 'Business Loan',
      amount: '₹25 Lakhs',
      time: '48 Hours',
    },
    {
      id: 2,
      name: 'Priya Sharma',
      role: 'Software Engineer',
      location: 'Bangalore',
      content: 'I was struggling with my home loan application due to documentation issues. The team at Loanbazaar guided me through every step, and I got my sanction letter in a week!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      loanType: 'Home Loan',
      amount: '₹75 Lakhs',
      time: '7 Days',
    },
    {
      id: 3,
      name: 'Amit Verma',
      role: 'Freelance Designer',
      location: 'Delhi',
      content: 'The best part about Loanbazaar is their transparency. No hidden charges, no fake promises. They got me a personal loan when others rejected my application.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      loanType: 'Personal Loan',
      amount: '₹5 Lakhs',
      time: '24 Hours',
    },
    {
      id: 4,
      name: 'Sneha Patel',
      role: 'Restaurant Owner',
      location: 'Ahmedabad',
      content: 'Expanding my restaurant chain seemed impossible until I found Loanbazaar. They understood my business needs and got me the perfect financing solution with minimal documentation.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      loanType: 'Business Loan',
      amount: '₹40 Lakhs',
      time: '3 Days',
    },
    {
      id: 5,
      name: 'Vikram Singh',
      role: 'IT Consultant',
      location: 'Pune',
      content: 'I needed a loan against property urgently for a family medical emergency. Loanbazaar team worked overtime to ensure I got the disbursement within 5 days. Forever grateful!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      loanType: 'Loan Against Property',
      amount: '₹1.2 Crore',
      time: '5 Days',
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Happy Customers' },
    { value: '₹500Cr+', label: 'Loans Disbursed' },
    { value: '4.9/5', label: 'Customer Rating' },
    { value: '48 Hrs', label: 'Avg. Approval Time' },
  ];


  return (
    <div className="py-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100/50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4 border border-blue-200">
            <BadgeCheck className="w-4 h-4" />
            VERIFIED SUCCESS STORIES
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Real People, Real Results
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Join thousands who have transformed their financial dreams into reality
          </p>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="bg-gradient-to-br from-white to-blue-50/40 border-2 border-blue-100 rounded-2xl p-6 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent mb-1">{stat.value}</div>
              <div className="text-gray-600 text-sm font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Horizontal Scrolling Cards */}
        <div className="relative">
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth hide-scrollbar"
            style={{ 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            onScroll={(e) => {
              const container = e.currentTarget;
              const scrollLeft = container.scrollLeft;
              const cardWidth = 320; // w-[320px] + gap-4 (16px) = 336px total
              const newIndex = Math.round(scrollLeft / (cardWidth + 16));
              setCurrentIndex(newIndex);
            }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="flex-shrink-0 w-[300px] md:w-[320px] snap-start">
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => {
                const container = scrollContainerRef.current;
                if (container) {
                  const cardWidth = 320;
                  const gap = 16;
                  const newIndex = Math.max(0, currentIndex - 1);
                  container.scrollTo({
                    left: newIndex * (cardWidth + gap),
                    behavior: 'smooth'
                  });
                  setCurrentIndex(newIndex);
                }
              }}
              disabled={currentIndex === 0}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md ${
                currentIndex === 0
                  ? 'bg-white border-2 border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50'
              }`}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={() => {
                const container = scrollContainerRef.current;
                if (container) {
                  const cardWidth = 320;
                  const gap = 16;
                  const newIndex = Math.min(testimonials.length - 1, currentIndex + 1);
                  container.scrollTo({
                    left: newIndex * (cardWidth + gap),
                    behavior: 'smooth'
                  });
                  setCurrentIndex(newIndex);
                }
              }}
              disabled={currentIndex >= testimonials.length - 1}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md ${
                currentIndex >= testimonials.length - 1
                  ? 'bg-white border-2 border-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50'
              }`}
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Testimonial Card Component - Sleek Horizontal Design
const TestimonialCard = ({ 
  testimonial
}: { 
  testimonial: any;
}) => {
  return (
    <div className="relative group h-full">
      <div className="relative h-full bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 p-5">
        
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-orange-400 rounded-t-2xl" />
        
        {/* Verified Badge */}
        <div className="absolute top-3 right-3 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
          <BadgeCheck className="w-2.5 h-2.5" />
          Verified
        </div>

        {/* User Info - Compact */}
        <div className="flex items-center gap-3 mb-4 mt-2">
          <div className="relative shrink-0">
            <img 
              src={testimonial.image} 
              alt={testimonial.name} 
              className="h-12 w-12 rounded-xl object-cover border-2 border-blue-100"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
              <BadgeCheck className="w-2 h-2 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-gray-900 truncate">{testimonial.name}</h4>
            <p className="text-xs text-gray-500 truncate">{testimonial.role} • {testimonial.location}</p>
          </div>
        </div>

        {/* Rating - Compact */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-3 w-3 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
            />
          ))}
          <span className="ml-1 text-xs font-semibold text-gray-600">{testimonial.rating}.0</span>
        </div>

        {/* Content - Compact */}
        <p className="text-sm text-gray-700 leading-relaxed mb-4 line-clamp-3">
          &ldquo;{testimonial.content}&rdquo;
        </p>

        {/* Loan Details - Compact Horizontal */}
        <div className="flex gap-2 pt-3 border-t border-gray-100">
          <div className="flex-1 bg-blue-50 rounded-lg p-2 text-center border border-blue-100">
            <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5 font-semibold">Type</div>
            <div className="text-xs font-bold text-blue-900 truncate">{testimonial.loanType}</div>
          </div>
          <div className="flex-1 bg-green-50 rounded-lg p-2 text-center border border-green-100">
            <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5 font-semibold">Amount</div>
            <div className="text-xs font-bold text-green-700">{testimonial.amount}</div>
          </div>
          <div className="flex-1 bg-orange-50 rounded-lg p-2 text-center border border-orange-100">
            <div className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5 font-semibold flex items-center justify-center gap-0.5">
              <Clock className="w-2 h-2" />
              Time
            </div>
            <div className="text-xs font-bold text-orange-700">{testimonial.time}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
