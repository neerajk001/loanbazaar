import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact-us" className="bg-blue-950 text-white pt-8 pb-4 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src="/com-logo.png" alt="loanbazaar Logo" className="h-32 w-auto" />
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted partner for all financial needs. We make borrowing simple, transparent, and fast.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-orange-500 transition-colors"><Linkedin className="h-5 w-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-orange-500">Loan</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/loan/personal-loan" className="hover:text-white transition-colors">Personal Loan</Link></li>
              <li><Link href="/loan/business-loan" className="hover:text-white transition-colors">Business Loan</Link></li>
              <li><Link href="/loan/home-loan" className="hover:text-white transition-colors">Home Loan</Link></li>
              <li><Link href="/loan/loan-against-property" className="hover:text-white transition-colors">Loan Against Property</Link></li>
              <li><Link href="/loan/education-loan" className="hover:text-white transition-colors">Education Loan</Link></li>
              <li><Link href="/loan/car-loan" className="hover:text-white transition-colors">Car Loan</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-orange-500">Insurance</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/insurance/health-insurance" className="hover:text-white transition-colors">Health Insurance</Link></li>
              <li><Link href="/insurance/term-life-insurance" className="hover:text-white transition-colors">Term Life Insurance</Link></li>
              <li><Link href="/insurance/car-insurance" className="hover:text-white transition-colors">Car Insurance</Link></li>
              <li><Link href="/insurance/bike-insurance" className="hover:text-white transition-colors">Bike Insurance</Link></li>
              <li><Link href="/insurance/loan-protector" className="hover:text-white transition-colors">Loan Protector</Link></li>
              <li><Link href="/insurance/emi-protector" className="hover:text-white transition-colors">EMI Protector</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-orange-500">Company</h4>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/apply" className="hover:text-white transition-colors">Apply Now</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/calculator" className="hover:text-white transition-colors">Calculators</Link></li>
              <li><Link href="/check-eligibility" className="hover:text-white transition-colors">Check Eligibility</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-orange-500">Contact</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-2 hover:text-white transition-colors">
                <Mail className="h-5 w-5 mt-0.5 flex-shrink-0 text-orange-500" />
                <a href="mailto:info@loansarathi.com" className="hover:text-white transition-colors">
                  info@loansarathi.com
                </a>
              </li>
              <li className="flex items-start gap-2 hover:text-white transition-colors">
                <Phone className="h-5 w-5 mt-0.5 flex-shrink-0 text-orange-500" />
                <a href="tel:+919588833303" className="hover:text-white transition-colors">
                  +91 95888 33303
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-orange-500" />
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Mumbai,+India" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Mumbai, India
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Loanbazaar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
