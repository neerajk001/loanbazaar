import React from 'react';
import { ArrowRight, Zap, BadgeCheck } from 'lucide-react';

const FeaturedPartners = () => {
  const offers = [
    {
      id: 1,
      partnerName: "Poonawalla Fincorp",
      productType: "Instant Personal Loan",
      amount: "up to ₹15 Lakhs",
      tags: ["Zero Pre-Payment", "No Hidden Charges", "Digital Process"],
      applyUrl: "https://instant-pocket-loan.poonawallafincorp.com/?redirectto=primepl&utm_medium=QR_Code&utm_DSA_Code=PMH00154&UTM_Partner_Name=FINBROS_CAPITAL_ADVISORY_PVT_LTD&UTM_SM_Name=imran.shaikh@poonawallafincorp.com",
      // Blue Theme Gradient
      wrapperClass: "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800", 
      buttonClass: "bg-yellow-400 text-blue-900 hover:bg-yellow-300",
      logoText: "POONAWALLA FINCORP",
      logoColor: "text-blue-700",
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      highlightText: "text-yellow-400"
    },
    {
      id: 2,
      partnerName: "InCred Finance",
      productType: "Personal Loan",
      amount: "up to ₹10 Lakhs",
      tags: ["Instant Approval", "Flexible Tenure", "Quick Disbursal"],
      applyUrl: "https://www.incred.com/personal-loan/?partnerId=1537007886761043P&utm_medium=xx&utm_campaign=ORG02323&utm_source=xx",
      // Orange Theme Gradient
      wrapperClass: "bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700",
      buttonClass: "bg-white text-orange-600 hover:bg-gray-50",
      logoText: "InCred finance",
      logoColor: "text-orange-600",
      icon: <BadgeCheck className="w-5 h-5 text-white" />,
      highlightText: "text-white"
    }
  ];

  return (
    <div className="py-8 bg-gradient-to-br from-slate-50/80 to-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        {offers.map((offer) => (
          <div 
            key={offer.id} 
            className={`rounded-2xl p-4 md:p-5 ${offer.wrapperClass} shadow-lg transition-transform duration-300 hover:-translate-y-1`}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
              
              {/* Left Content */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="hidden sm:flex shrink-0 w-10 h-10 bg-white/10 rounded-lg items-center justify-center backdrop-blur-sm">
                  {offer.icon}
                </div>
                
                <div className="text-center sm:text-left flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white/90">
                      {offer.partnerName}
                    </h3>
                    <span className={`hidden sm:inline-block w-1 h-1 rounded-full bg-white/40`}></span>
                    <span className={`text-sm font-bold ${offer.highlightText}`}>
                      {offer.productType}
                    </span>
                  </div>
                  
                  <div className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
                    {offer.amount}
                  </div>
                  
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    {offer.tags.map((tag, i) => (
                      <span 
                        key={i} 
                        className="bg-white/20 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-md border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Content - Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto min-w-[240px]">
                <a
                  href={offer.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${offer.buttonClass} w-full sm:w-auto px-5 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm`}
                >
                  Apply Now <ArrowRight className="w-3 h-3" />
                </a>
                
                <div className="w-full sm:w-auto bg-white py-2.5 px-4 rounded-lg flex items-center justify-center shadow-sm min-w-[120px]">
                  <span className={`font-bold text-[10px] uppercase tracking-wider ${offer.logoColor}`}>
                    {offer.logoText}
                  </span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPartners;
