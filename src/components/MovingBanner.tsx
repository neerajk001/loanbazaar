'use client';
import React from 'react';

export default function MovingBanner() {
  return (
    <div className="relative w-full bg-white border-b border-gray-200 overflow-hidden py-1.5 z-40">
      <div className="flex whitespace-nowrap animate-scroll">
        {/* First set of content */}
        <div className="flex items-center gap-8 px-8">
          <span className="text-blue-700 font-semibold text-sm md:text-base">
            Struggling to manage multiple EMIs?
          </span>
          <span className="text-blue-700 font-semibold text-sm md:text-base">
            Say goodbye to financial stress with Debt Consolidation!
          </span>
          <span className="text-blue-700 font-semibold text-sm md:text-base">
            Combine all your unsecured loans and credit card dues into one easy EMI
          </span>
          <span className="text-blue-700 font-semibold text-sm md:text-base">
            Reduce your monthly burden by up to 50%.
          </span>
          <span className="text-blue-700 font-semibold text-sm md:text-base flex items-center gap-2">
            <span className="inline-block">•</span>
            <span>One EMI. Zero Stress. Total Freedom.</span>
          </span>
        </div>
        
        {/* Duplicate for seamless loop */}
        <div className="flex items-center gap-8 px-8" aria-hidden="true">
          <span className="text-blue-700 font-semibold text-sm md:text-base">
            Struggling to manage multiple EMIs?
          </span>
          <span className="text-blue-700 font-semibold text-sm md:text-base">
            Say goodbye to financial stress with Debt Consolidation!
          </span>
          <span className="text-blue-700 font-semibold text-sm md:text-base">
            Combine all your unsecured loans and credit card dues into one easy EMI
          </span>
          <span className="text-blue-700 font-semibold text-sm md:text-base">
            Reduce your monthly burden by up to 50%.
          </span>
          <span className="text-blue-700 font-semibold text-sm md:text-base flex items-center gap-2">
            <span className="inline-block">•</span>
            <span>One EMI. Zero Stress. Total Freedom.</span>
          </span>
        </div>
      </div>
    </div>
  );
}

