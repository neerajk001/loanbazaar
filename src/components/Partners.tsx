import React from 'react';

const Partners = () => {
  // Bank logos from public/bank folder
  const bankLogos = [
    { name: 'HDFC Bank', image: '/bank/hdfc_91c77b0063.svg', bgColor: 'bg-blue-50' },
    { name: 'ICICI Bank', image: '/bank/icic_42620b9bc5.svg', bgColor: 'bg-orange-50' },
    { name: 'InCred', image: '/bank/incred_a752b4e95b.svg', bgColor: 'bg-orange-50' },
    { name: 'IndusInd', image: '/bank/indusind_88fb65b8b2.svg', bgColor: 'bg-blue-50' },
    { name: 'Tata Capital', image: '/bank/tata_a40c73b611.svg', bgColor: 'bg-blue-50' },
  ];

  // Duplicate the array for seamless infinite scroll
  const duplicatedLogos = [...bankLogos, ...bankLogos];

  return (
    <div className="bg-gradient-to-br from-white/80 to-blue-50/20 py-8 border-b border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-gray-500 tracking-wider uppercase mb-6">
          We facilitate loans through India's leading partners
        </p>
        
        {/* Scrolling container */}
        <div className="relative">
          <div className="flex animate-scroll gap-8 items-center">
            {duplicatedLogos.map((bank, index) => (
              <div
                key={`${bank.name}-${index}`}
                className="flex-shrink-0 flex items-center justify-center min-w-[200px] h-28"
              >
                <img
                  src={bank.image}
                  alt={bank.name}
                  className="max-h-24 max-w-[200px] object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;

