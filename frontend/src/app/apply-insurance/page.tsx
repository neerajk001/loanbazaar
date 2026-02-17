'use client';
export const dynamic = 'force-dynamic';
import React, { Suspense } from 'react';
import InsuranceApplicationForm from '@/components/InsuranceApplicationForm';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function ApplyInsuranceContent() {
  const searchParams = useSearchParams();
  const insuranceType = searchParams.get('type') || 'health';

  return (
    <main className="min-h-screen bg-gray-900/40 backdrop-blur-sm fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-end justify-center md:items-center p-0 md:p-4">
        {/* Backdrop click to close */}
        <Link href="/" className="absolute inset-0 cursor-default" aria-label="Close modal" />
        
        <div className="w-full max-w-3xl relative z-10">
          <InsuranceApplicationForm insuranceType={insuranceType} />
        </div>
      </div>
    </main>
  );
}

export default function ApplyInsurancePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
      <ApplyInsuranceContent />
    </Suspense>
  );
}

