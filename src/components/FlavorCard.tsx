import React from 'react';
import Image from 'next/image';
import { FlavorInfo } from '@/lib/flavorData';
import AddToCartButton from '@/components/AddToCartButton';

interface FlavorCardProps {
  flavor: FlavorInfo;
  className?: string;
}

// Static class mappings to avoid dynamic class construction
const colorClasses = {
  green: {
    bgGradient: 'bg-gradient-to-br from-green-50 to-green-100',
    borderGradient: 'bg-gradient-to-br from-green-200 to-green-400',
    border: 'border-green-200/50',
    shadow: 'group-hover:shadow-green-200/40',
    accent: 'bg-green-500/10',
    circleGradient: 'from-green-100 to-green-300',
    textColor: 'text-green-700',
    bulletColor: 'bg-green-500',
    bottomGradient: 'from-green-300 to-green-500',
  },
  yellow: {
    bgGradient: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
    borderGradient: 'bg-gradient-to-br from-yellow-200 to-yellow-400',
    border: 'border-yellow-200/50',
    shadow: 'group-hover:shadow-yellow-200/40',
    accent: 'bg-yellow-500/10',
    circleGradient: 'from-yellow-100 to-yellow-300',
    textColor: 'text-yellow-700',
    bulletColor: 'bg-yellow-500',
    bottomGradient: 'from-yellow-300 to-yellow-500',
  },
  orange: {
    bgGradient: 'bg-gradient-to-br from-orange-50 to-orange-100',
    borderGradient: 'bg-gradient-to-br from-orange-200 to-orange-400',
    border: 'border-orange-200/50',
    shadow: 'group-hover:shadow-orange-200/40',
    accent: 'bg-orange-500/10',
    circleGradient: 'from-orange-100 to-orange-300',
    textColor: 'text-orange-700',
    bulletColor: 'bg-orange-500',
    bottomGradient: 'from-orange-300 to-orange-500',
  },
};

const gradientClasses = {
  'green-400': 'from-green-400',
  'green-600': 'to-green-600',
  'yellow-400': 'from-yellow-400',
  'yellow-500': 'to-yellow-500',
  'orange-400': 'from-orange-400',
  'orange-600': 'to-orange-600',
};

const FlavorCard: React.FC<FlavorCardProps> = ({ flavor, className = '' }) => {
  const colors = colorClasses[flavor.color as keyof typeof colorClasses];
  const gradientFrom = gradientClasses[flavor.gradientFrom as keyof typeof gradientClasses];
  const gradientTo = gradientClasses[flavor.gradientTo as keyof typeof gradientClasses];

  return (
    <div className={`flavor-card group h-[520px] relative ${className}`}>
      {/* Background gradient and blur effects */}
      <div className={`absolute inset-0 ${colors.bgGradient} rounded-2xl transform transition-transform duration-500 group-hover:scale-[0.98]`}></div>
      <div className={`absolute -inset-0.5 ${colors.borderGradient} opacity-50 rounded-2xl blur-sm group-hover:opacity-80 transition duration-500`}></div>
      
      {/* Card content */}
      <div className={`relative flex flex-col h-full bg-white/80 backdrop-blur-md p-8 rounded-2xl ${colors.border} shadow-xl transition-all duration-500 ${colors.shadow} overflow-hidden`}>
        {/* Top decorative accent */}
        <div className={`absolute top-0 left-0 w-40 h-40 ${colors.accent} rounded-br-[100px] -translate-x-10 -translate-y-10 blur-md`}></div>
        <div className={`absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br ${colors.circleGradient} opacity-70 blur-md`}></div>
        
        {/* Flavour icon */}
        <div className="flex justify-center mb-6">
          <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center transform transition-transform duration-500 group-hover:rotate-12`}>
            <Image 
              src="/white_transparent_OSlashLogo.png" 
              alt={`${flavor.name} Flavour`} 
              width={40} 
              height={40} 
              className="object-contain"
            />
          </div>
        </div>
        
        <h3 className={`text-2xl font-bold text-center ${colors.textColor} mb-4`}>{flavor.name}</h3>
        
        <div className="relative flex-grow overflow-hidden">
          <div className="h-[180px] flex items-center">
            <p className="text-gray-700 leading-relaxed transform transition-transform duration-500 group-hover:translate-y-[-8px] opacity-100 group-hover:opacity-0">
              {flavor.description}
            </p>
          </div>

          {/* Hover details */}
          <div className="absolute inset-0 flex flex-col justify-center transform transition-all duration-500 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
            <span className={`${colors.textColor} font-semibold mb-2`}>{flavor.hoverDescription}</span>
            <ul className="text-gray-700 text-sm mb-4">
              {flavor.perfectFor.map((item, index) => (
                <li key={index} className="flex items-center mb-1">
                  <span className={`w-2 h-2 rounded-full ${colors.bulletColor} mr-2`}></span>
                  {item}
                </li>
              ))}
            </ul>
            <AddToCartButton
              priceId={flavor.priceId}
              flavor={flavor.name}
              className={`mt-4 mx-auto px-6 py-2 bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105`}
            />
          </div>
        </div>
        
        {/* Bottom accent */}
        <div className="mt-auto flex justify-center">
          <div className={`w-16 h-1 bg-gradient-to-r ${colors.bottomGradient} rounded-full`}></div>
        </div>
      </div>
    </div>
  );
};

export default FlavorCard; 