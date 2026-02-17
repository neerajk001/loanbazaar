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

// TestimonialCard Component - Minimal Design
const TestimonialCard = ({
  testimonial
}: {
  testimonial: any;
}) => {
  return (
    <div className="h-full py-2 px-1">
      <div className="h-full bg-white rounded-2xl border border-gray-200 p-6 flex flex-col shadow-sm transition-shadow duration-300">

        {/* Header: Profile */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src={testimonial.image}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover bg-gray-50"
          />
          <div>
            <h4 className="text-base font-semibold text-gray-900 leading-none mb-1">{testimonial.name}</h4>
            <div className="flex items-center text-sm text-gray-500">
              <span>{testimonial.role}</span>
              <span className="mx-2">•</span>
              <span>{testimonial.location}</span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              fill={i < testimonial.rating ? "#FBBF24" : "none"}
              className={`${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-200'}`}
            />
          ))}
        </div>

        {/* Content */}
        <blockquote className="text-gray-600 leading-relaxed text-[15px] flex-grow mb-6">
          "{testimonial.content}"
        </blockquote>

        {/* Footer info - Minimal text */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-medium text-gray-500 uppercase tracking-wide">
          <div>
            <span className="text-gray-400 mr-2">Loan Type</span>
            <span className="text-gray-900">{testimonial.loanType}</span>
          </div>
          <div>
            <span className="text-gray-400 mr-2">Amount</span>
            <span className="text-gray-900">{testimonial.amount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
