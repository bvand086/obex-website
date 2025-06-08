"use client";

import React from "react";
import { FLAVOR_DATA } from '@/lib/flavorData';
import FlavorCard from '@/components/FlavorCard';

const FlavourCardsSection: React.FC = () => {
  return (
    <div className="relative mb-16 z-30">
      <div className="max-w-3xl mx-auto text-center mb-12 relative z-10">
        <span className="inline-block px-4 py-1 bg-white/85 text-[#E9C46A] rounded-full text-sm font-medium mb-4 shadow-sm">Available Flavours</span>
        <h2 className="text-4xl font-bold text-[#2A9D8F] mb-4">Chef Developed Flavours</h2>
        <p className="text-gray-600 text-lg">
          Choose from three expertly crafted flavours, each designed to provide natural heartburn relief with an exceptional taste experience.
        </p>
      </div>
      
      {/* Flavour Cards Grid */}
      <div className="grid gap-8 md:grid-cols-3 mb-12 relative z-10">
        {FLAVOR_DATA.map((flavor) => (
          <FlavorCard key={flavor.id} flavor={flavor} />
        ))}
      </div>
    </div>
  );
};

export default FlavourCardsSection;