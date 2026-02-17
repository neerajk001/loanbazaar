'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import InsuranceProducts from '@/components/InsuranceProducts';
import Footer from '@/components/Footer';

export default function InsurancePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-8">
        <InsuranceProducts />
      </div>
      <Footer />
    </main>
  );
}

