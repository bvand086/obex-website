import React from 'react';
import Image from 'next/image';
import { FlavorInfo } from '@/lib/flavorData';
import AddToCartButton from '@/components/AddToCartButton';

interface FlavorCardProps {
  flavor: FlavorInfo;
  className?: string;
}

const FlavorCard: React.FC<FlavorCardProps> = ({ flavor, className = '' }) => {
  return (
    <div className={`flavor-card group h-[520px] relative ${className}`}>
      {/* Background gradient and blur effects */}
      <div className={`absolute inset-0 bg-gradient-to-br from-${flavor.color}-50 to-${flavor.color}-100 rounded-2xl transform transition-transform duration-500 group-hover:scale-[0.98]`}></div>
      <div className={`absolute -inset-0.5 bg-gradient-to-br from-${flavor.color}-200 to-${flavor.color}-400 opacity-50 rounded-2xl blur-sm group-hover:opacity-80 transition duration-500`}></div>
      
      {/* Card content */}
      <div className={`relative flex flex-col h-full bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-${flavor.color}-200/50 shadow-xl transition-all duration-500 group-hover:shadow-${flavor.color}-200/40 overflow-hidden`}>
        {/* Top decorative accent */}
        <div className={`absolute top-0 left-0 w-40 h-40 bg-${flavor.color}-500/10 rounded-br-[100px] -translate-x-10 -translate-y-10 blur-md`}></div>
        <div className={`absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-${flavor.color}-100 to-${flavor.color}-300 opacity-70 blur-md`}></div>
        
        {/* Flavour icon */}
        <div className="flex justify-center mb-6">
          <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-${flavor.gradientFrom} to-${flavor.gradientTo} flex items-center justify-center transform transition-transform duration-500 group-hover:rotate-12`}>
            <Image 
              src="/white_transparent_OSlashLogo.png" 
              alt={`${flavor.name} Flavour`} 
              width={40} 
              height={40} 
              className="object-contain"
            />
          </div>
        </div>
        
        <h3 className={`text-2xl font-bold text-center text-${flavor.accentColors.dark} mb-4`}>{flavor.name}</h3>
        
        <div className="relative flex-grow overflow-hidden">
          <div className="h-[180px] flex items-center">
            <p className="text-gray-700 leading-relaxed transform transition-transform duration-500 group-hover:translate-y-[-8px] opacity-100 group-hover:opacity-0">
              {flavor.description}
            </p>
          </div>

          {/* Hover details */}
          <div className="absolute inset-0 flex flex-col justify-center transform transition-all duration-500 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
            <span className={`text-${flavor.accentColors.dark} font-semibold mb-2`}>{flavor.hoverDescription}</span>
            <ul className="text-gray-700 text-sm mb-4">
              {flavor.perfectFor.map((item, index) => (
                <li key={index} className="flex items-center mb-1">
                  <span className={`w-2 h-2 rounded-full bg-${flavor.color}-500 mr-2`}></span>
                  {item}
                </li>
              ))}
            </ul>
            <AddToCartButton
              priceId={flavor.priceId}
              flavor={flavor.name}
              className={`mt-4 mx-auto px-6 py-2 bg-gradient-to-r from-${flavor.gradientFrom} to-${flavor.gradientTo} text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105`}
            />
          </div>
        </div>
        
        {/* Bottom accent */}
        <div className="mt-auto flex justify-center">
          <div className={`w-16 h-1 bg-gradient-to-r from-${flavor.color}-300 to-${flavor.color}-500 rounded-full`}></div>
        </div>
      </div>
    </div>
  );
};

export default FlavorCard; 