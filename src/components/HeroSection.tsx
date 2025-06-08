"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import RotatingLinesGrid from './RotatingLinesGrid';

interface HeroSectionProps {
  onScrollToSection: (id: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToSection }) => {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen py-16 px-4 bg-gradient-to-b from-[#F4A261] to-[#E9C46A] text-white overflow-hidden">
      <RotatingLinesGrid />
      <div className="max-w-xs sm:max-w-2xl text-center mx-auto relative z-10">
        <h2 className="mb-4 text-4xl sm:text-5xl font-bold text-green-800">Experience the Power of</h2>
        <h1 className="mb-4 text-6xl sm:text-[10rem] font-extrabold text-green-800 tracking-widest">ØBEX</h1>
        <p className="mb-8 text-lg sm:text-xl text-green-600">Your Natural Barrier Against Heartburn</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button className="w-full sm:w-auto px-6 py-2 bg-[#E9C46A] text-[#264653] font-medium rounded-lg hover:bg-[#e0bb5e] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105" onClick={() => onScrollToSection('cta-section')}>
            Buy Now
          </Button>
          <button className="w-full sm:w-auto px-6 py-2 border-2 border-[#2A9D8F] text-[#2A9D8F] font-medium rounded-lg hover:bg-[#2A9D8F]/10 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105" onClick={() => onScrollToSection('product_details')}>
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;