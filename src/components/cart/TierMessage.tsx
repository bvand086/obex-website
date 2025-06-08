"use client";

import React from "react";
import { Check } from 'lucide-react';

interface TierMessageProps {
  totalBottles: number;
  currentTier: string;
}

const TierMessage: React.FC<TierMessageProps> = ({ totalBottles, currentTier }) => {
  const tierBgColor = currentTier === 'premium' ? 'bg-[#2A9D8F]/10' : currentTier === 'value' ? 'bg-[#F4A261]/10' : '';
  const tierTextColor = currentTier === 'premium' ? 'text-[#2A9D8F]' : currentTier === 'value' ? 'text-[#F4A261]' : '';
  const tierMessage = currentTier === 'premium' 
    ? "You've reached the Premium tier (20% off + $6.29 flat-rate shipping)" 
    : currentTier === 'value' 
      ? "You've reached the Value tier (14% off)" 
      : "Add more bottles for discounts";

  const getTierBorderColor = () => {
    if (currentTier === 'premium') return 'border-[#2A9D8F]/30';
    if (currentTier === 'value') return 'border-[#F4A261]/30';
    return 'border-[#E9C46A]/30';
  };

  if (totalBottles === 0) return null;

  return (
    <div className={`mb-6 p-3 rounded-lg text-center border ${tierBgColor} ${tierTextColor} ${getTierBorderColor()}`}>
      <div className="flex items-center justify-center">
        {currentTier === 'premium' && <Check className="h-5 w-5 mr-2 text-[#2A9D8F]" />}
        <span className="font-medium">{tierMessage}</span>
      </div>
    </div>
  );
};

export default TierMessage;