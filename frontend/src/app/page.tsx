import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturedPartners from '@/components/FeaturedPartners';
import Partners from '@/components/Partners';
import Features from '@/components/Features';
import Products from '@/components/Products';
import InsuranceProducts from '@/components/InsuranceProducts';
import Process from '@/components/Process';
import FundingPath from '@/components/FundingPath';
import Calculator from '@/components/Calculator';

import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="bg-gray-50">
      <Navbar />
      <div>
        <Hero />
      </div>
      {/* <div className="bg-slate-50/80">
        <FeaturedPartners />
      </div>
      <div className="bg-white/60">
        <Partners />
      </div> */}

      <div>
        <Products />
      </div>
      <div>
        <InsuranceProducts />
      </div>
      {/* <div className="bg-gradient-to-br from-blue-50/30 via-slate-50 to-orange-50/20">
        <FundingPath />
      </div> */}
      <div>
        <Calculator />
      </div>

      <div>
        <Features />
      </div>
      <div>
        <Testimonials />
      </div>
      <div>
        <FAQ />
      </div>
      <Footer />
    </main>
  );
}
