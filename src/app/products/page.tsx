'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import Products from '@/components/Products';
import InsuranceProducts from '@/components/InsuranceProducts';
import Footer from '@/components/Footer';

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-8">
        <Products />
        <InsuranceProducts />
      </div>
      <Footer />
    </main>
  );
}

