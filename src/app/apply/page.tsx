'use client';
export const dynamic = 'force-dynamic';
import React, { Suspense } from 'react';
import ApplicationForm from '@/components/ApplicationForm';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';

function ApplyPageContent() {
  const searchParams = useSearchParams();
  const loanType = searchParams.get('type') || 'personal';

  return (
    <main className="min-h-screen bg-gray-900/40 backdrop-blur-sm fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-end justify-center md:items-center p-0 md:p-4">
        {/* Backdrop click to close - optional but good UX */}
        <Link href="/" className="absolute inset-0 cursor-default" aria-label="Close modal" />
        
        <div className="w-full max-w-6xl relative z-10">
            <ApplicationForm loanType={loanType} />
        </div>
      </div>
    </main>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
      <ApplyPageContent />
    </Suspense>
  );
}
