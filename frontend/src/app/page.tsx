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

      <div className="bg-white">
        <Products />
      </div>
      <div className="bg-gradient-to-b from-blue-50/50 to-indigo-50/50 pt-8 pb-12">
        <InsuranceProducts />
      </div>
      {/* <div className="bg-gradient-to-br from-blue-50/30 via-slate-50 to-orange-50/20">
        <FundingPath />
      </div> */}
      <div className="bg-white">
        <Calculator />
      </div>

      <div className="bg-gradient-to-b from-slate-50 to-slate-100">
        <Features />
      </div>

      <div className="bg-white">
        <FAQ />
      </div>

      {/* Modern High-Impact CTA Anchor */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-900 py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/20 rounded-full blur-[80px] -translate-x-1/2 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ready to get the best rates?</h2>
          <p className="text-xl text-blue-100/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Talk to our experts today and secure a hassle-free, fully transparent loan tailored perfectly to your financial goals.
          </p>
          <a href="/contact" className="inline-flex items-center gap-2 bg-blue-500 text-white font-bold px-8 py-4 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:-translate-y-1 transition-all text-lg border border-blue-400">
            Get Started Now
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
