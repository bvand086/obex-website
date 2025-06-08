"use client";

import React from "react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ShippingNotice from '@/components/cart/ShippingNotice';

const BundleOptions: React.FC = () => {
  return (
    <div className="relative mb-16 z-30">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2A9D8F]/5 to-[#264653]/5 rounded-2xl transform transition-transform duration-500"></div>
      
      {/* Bundle background product elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-8 -left-8 w-40 h-56 transform -rotate-12 opacity-5">
          <div className="w-full h-full bg-gradient-to-br from-[#E9C46A] to-[#E9C46A]/60 rounded-2xl">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-24 bg-white/30 rounded-full"></div>
          </div>
        </div>
        
        <div className="absolute -bottom-6 -right-6 w-36 h-48 transform rotate-6 opacity-5">
          <div className="w-full h-full bg-gradient-to-br from-[#2A9D8F] to-[#2A9D8F]/60 rounded-2xl">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-9 h-20 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>
      <div className="relative bg-white/95 backdrop-blur-md p-12 rounded-2xl shadow-xl border border-[#2A9D8F]/10">
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-1 bg-[#264653]/10 text-[#264653] rounded-full text-sm font-medium mb-4">Bundle Options</span>
          <h2 className="text-3xl font-bold text-[#264653] mb-4">Choose Your Package</h2>
          <p className="text-gray-600 text-lg">
            Select the perfect OBEX bundle that fits your needs and enjoy greater savings with larger packages.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Starter Bundle */}
          <div className="bg-gradient-to-br from-[#E9C46A]/10 to-white p-6 rounded-xl border border-[#E9C46A]/20 flex flex-col h-full">
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-[#264653] mb-2">Starter</h3>
              <p className="text-2xl font-bold text-[#2A9D8F] mb-1">$28.99</p>
              <div className="h-6 mb-4"></div> {/* Spacer for alignment */}
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• 1 bottle of OBEX</li>
                <li>• Choose your flavour</li>
                <li>• Perfect for trying OBEX</li>
              </ul>
            </div>
            <Button className="w-full bg-[#E9C46A] text-[#264653] hover:bg-[#e0bb5e] mt-auto">
              Select Starter
            </Button>
          </div>
          
          {/* Value Bundle */}
          <div className="bg-gradient-to-br from-[#2A9D8F]/10 to-white p-6 rounded-xl border border-[#2A9D8F]/20 relative flex flex-col h-full">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-[#2A9D8F] text-white px-3 py-1 rounded-full text-xs font-medium">
              Most Popular
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-[#264653] mb-2">Value</h3>
              <p className="text-2xl font-bold text-[#2A9D8F] mb-1">$74.99</p>
              <p className="text-sm text-gray-500 line-through mb-4">$86.97</p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• 3 bottles of OBEX</li>
                <li>• Mix and match flavours</li>
                <li>• 14% savings</li>
              </ul>
            </div>
            <Button className="w-full bg-[#2A9D8F] text-white hover:bg-[#238276] mt-auto">
              Select Value
            </Button>
          </div>
          
          {/* Premium Bundle */}
          <div className="bg-gradient-to-br from-[#264653]/10 to-white p-6 rounded-xl border border-[#264653]/20 flex flex-col h-full">
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-[#264653] mb-2">Premium</h3>
              <p className="text-2xl font-bold text-[#2A9D8F] mb-1">$139.99</p>
              <p className="text-sm text-gray-500 line-through mb-4">$173.94</p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>• 6 bottles of OBEX</li>
                <li>• All three flavours included</li>
                <li>• 20% savings + free shipping</li>
              </ul>
            </div>
            <Button className="w-full bg-[#264653] text-white hover:bg-[#1e3a3a] mt-auto">
              Select Premium
            </Button>
          </div>
        </div>
        
        {/* Canadian Shipping Notice */}
        <div className="mt-8">
          <ShippingNotice />
        </div>
        
        <div className="text-center mt-8">
          <Link 
            href="/#cta-section" 
            className="inline-flex items-center text-[#2A9D8F] hover:text-[#264653] transition-colors duration-300"
          >
            <span className="font-medium">View detailed pricing →</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BundleOptions;