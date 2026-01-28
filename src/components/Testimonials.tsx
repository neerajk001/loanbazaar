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
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md ${currentIndex === 0
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
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md ${currentIndex >= testimonials.length - 1
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

// TestimonialCard Component - Premium Glassmorphic Design
const TestimonialCard = ({
  testimonial
}: {
  testimonial: any;
}) => {
  return (
    <div className="relative group h-full py-2 px-1">
      <div className="relative h-full bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col">

        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <svg /* Quote Icon */ width="100" height="100" viewBox="0 0 24 24" fill="currentColor" className="text-blue-900 transform rotate-12">
            <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
          </svg>
        </div>

        {/* Soft Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-transparent to-blue-100/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative z-10 p-6 flex flex-col h-full">

          {/* Header: Profile */}
          <div className="flex items-center gap-4 mb-5">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-full p-1 bg-gradient-to-br from-blue-400 to-indigo-600 shadow-md transform group-hover:scale-105 transition-transform duration-300">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-full h-full rounded-full object-cover border-2 border-white bg-white"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full border-2 border-white shadow-sm ring-1 ring-green-100" title="Verified User">
                <BadgeCheck className="w-3 h-3" />
              </div>
            </div>

            <div className="min-w-0">
              <h4 className="text-lg font-bold text-gray-900 leading-tight truncate pr-2 group-hover:text-blue-700 transition-colors">{testimonial.name}</h4>
              <p className="text-sm text-gray-500 font-medium truncate">{testimonial.role}</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-400"></div>
                <span className="text-xs text-gray-400 font-medium truncate">{testimonial.location}</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-4 bg-yellow-50/50 w-fit px-2 py-1 rounded-lg border border-yellow-100/50">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                fill={i < testimonial.rating ? "#FBBF24" : "none"}
                className={`${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-200'}`}
              />
            ))}
            <span className="text-xs font-bold text-yellow-700 ml-1">{testimonial.rating}.0</span>
          </div>

          {/* Content */}
          <blockquote className="text-gray-600 leading-relaxed mb-6 text-[15px] flex-grow relative">
            "{testimonial.content}"
          </blockquote>

          {/* Stats Footer - Floating Cards */}
          <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-gray-100/80">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-3 border border-blue-100/80 shadow-sm group-hover:shadow-md transition-shadow">
              <p className="text-[10px] uppercase tracking-wider text-blue-400 font-bold mb-0.5 flex items-center gap-1">
                <TrendingUp size={10} /> Amount
              </p>
              <p className="text-sm font-extrabold text-gray-800">{testimonial.amount}</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-3 border border-indigo-100/80 shadow-sm group-hover:shadow-md transition-shadow">
              <p className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold mb-0.5 flex items-center gap-1">
                <BadgeCheck size={10} /> Type
              </p>
              <p className="text-sm font-extrabold text-gray-800 truncate" title={testimonial.loanType}>{testimonial.loanType}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
