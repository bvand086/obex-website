"use client";

import React from "react";
import { Check } from 'lucide-react';

interface FreeShippingBannerProps {
  freeShippingUnlocked: boolean;
  bottlesUntilFreeShipping: number;
}

const FreeShippingBanner: React.FC<FreeShippingBannerProps> = ({ 
  freeShippingUnlocked, 
  bottlesUntilFreeShipping 
}) => {
  return (
    <div className={`mb-6 p-3 rounded-lg text-center ${freeShippingUnlocked 
      ? 'bg-green-50 border border-green-200 text-green-700' 
      : 'bg-gray-50 border border-gray-200 text-gray-600'}`}>
      {freeShippingUnlocked ? (
        <div className="flex items-center justify-center">
          <Check className="h-5 w-5 mr-2 text-green-500" />
          <span className="font-medium">$6.29 flat-rate shipping unlocked ✓</span>
        </div>
      ) : (
        <span>Add {bottlesUntilFreeShipping} more {bottlesUntilFreeShipping === 1 ? 'bottle' : 'bottles'} for $6.29 flat-rate shipping</span>
      )}
    </div>
  );
};

export default FreeShippingBanner;