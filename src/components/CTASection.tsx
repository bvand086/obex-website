"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import AddToCartButton from '@/components/AddToCartButton';

interface CTASectionProps {
  onScrollToSection: (id: string) => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onScrollToSection }) => {
  return (
    <section id="cta-section" className="bg-[#2A9D8F] text-white py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Choose Your Bundle</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">Select the perfect OBEX package that suits your needs and budget</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter Package */}
          <div className="bg-white rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col h-full">
            <div className="bg-gray-100 p-6">
              <h3 className="text-2xl font-bold text-[#264653] mb-1">Starter</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-[#2A9D8F]">$28.99</span>
              </div>
            </div>
            
            <div className="p-6 space-y-4 flex-grow flex flex-col">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Regular total</span>
                  <span className="font-medium text-gray-700">$28.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">You pay</span>
                  <span className="font-medium text-gray-700">$28.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Unit price</span>
                  <span className="font-medium text-gray-700">$28.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Savings</span>
                  <span className="font-medium text-gray-700">—</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200 flex-grow flex flex-col">
                <p className="text-sm text-gray-600 mb-6 mt-4">Canadian-made, female-owned</p>
                <div className="mt-auto">
                  <AddToCartButton
                    priceId="price_starter"
                    flavor="Starter Package"
                    bundleType="starter"
                    className="w-full py-3 bg-[#E9C46A] text-[#264653] text-lg font-semibold rounded-lg hover:bg-[#e0bb5e] transition-all duration-300 shadow-md hover:shadow-xl"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Value Package */}
          <div className="bg-white rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl relative flex flex-col h-full">
            <div className="absolute top-0 right-0 bg-[#E9C46A] text-[#264653] py-1 px-4 rounded-bl-lg font-medium">
              Popular
            </div>
            
            <div className="bg-gray-100 p-6">
              <h3 className="text-2xl font-bold text-[#264653] mb-1">Value</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-[#2A9D8F]">$74.99</span>
                <span className="ml-2 text-sm line-through text-gray-500">$86.97</span>
              </div>
            </div>
            
            <div className="p-6 space-y-4 flex-grow flex flex-col">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Regular total</span>
                  <span className="font-medium text-gray-700">3×$28.99 = $86.97</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">You pay</span>
                  <span className="font-medium text-green-600">$74.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Unit price</span>
                  <span className="font-medium text-gray-700">$24.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Savings</span>
                  <span className="font-medium text-green-600">14% off</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200 flex-grow flex flex-col">
                <p className="text-sm text-gray-600 mt-4">Science-backed formula</p>
                <div className="flex justify-center mt-2">
                  <span className="text-[#F4A261] font-medium">★ Most popular ★</span>
                </div>
                <div className="mt-auto">
                  <AddToCartButton
                    priceId="price_value"
                    flavor="Value Package"
                    bundleType="value"
                    className="w-full py-3 bg-[#2A9D8F] text-white text-lg font-semibold rounded-lg hover:bg-[#238276] transition-all duration-300 shadow-md hover:shadow-xl"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Premium Package */}
          <div className="bg-white rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col h-full">
            <div className="bg-gray-100 p-6">
              <h3 className="text-2xl font-bold text-[#264653] mb-1">Premium</h3>
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-[#2A9D8F]">$139.99</span>
                <span className="ml-2 text-sm line-through text-gray-500">$173.94</span>
              </div>
            </div>
            
            <div className="p-6 space-y-4 flex-grow flex flex-col">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Regular total</span>
                  <span className="font-medium text-gray-700">6×$28.99 = $173.94</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">You pay</span>
                  <span className="font-medium text-green-600">$139.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Unit price</span>
                  <span className="font-medium text-gray-700">$23.33</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Savings</span>
                  <span className="font-medium text-green-600">20% off + Std. Shipping Included</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200 flex-grow flex flex-col">
                <p className="text-sm text-gray-600 mt-4">Chef-inspired flavours</p>
                <div className="flex justify-center mt-2">
                  <span className="text-[#F4A261] font-medium">🏆 Best value 🏆</span>
                </div>
                <div className="mt-auto">
                  <AddToCartButton
                    priceId="price_premium"
                    flavor="Premium Package"
                    bundleType="premium"
                    className="w-full py-3 bg-[#E9C46A] text-[#264653] text-lg font-semibold rounded-lg hover:bg-[#e0bb5e] transition-all duration-300 shadow-md hover:shadow-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-white/80 max-w-2xl mx-auto mb-6">
            All packages include our chef-crafted flavours: Orange Cream, Lemon Meringue, and Smooth Mint
          </p>
          
          {/* Canadian Shipping Notice */}
          <div className="mb-6 p-4 bg-white/10 border border-white/20 rounded-lg max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-2">
              <svg className="h-5 w-5 text-red-300 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-white font-medium">Shipping Notice</span>
            </div>
            <p className="text-white/90 text-sm">
              ØBEX products are currently only available for delivery within Canada. 
              International shipping is not available at this time.
            </p>
          </div>
          
          <Button 
            onClick={() => onScrollToSection('product_details')}
            className="px-8 py-3 bg-white text-[#2A9D8F] font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-xl"
          >
            Learn More About OBEX
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;