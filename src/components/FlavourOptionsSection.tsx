"use client";

import React from "react";
import Image from "next/image";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import FlavorCard from '@/components/FlavorCard';
import { FLAVOR_DATA } from '@/lib/flavorData';

interface FlavourOptionsSectionProps {
  onScrollToSection: (id: string) => void;
}

const FlavourOptionsSection: React.FC<FlavourOptionsSectionProps> = ({ onScrollToSection }) => {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/studio_image_medley.png" 
          alt="Studio background" 
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-white/60"></div>
      </div>
      <div className="absolute inset-0 opacity-20 z-0" style={{ 
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z\' fill=\'%232A9D8F\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
      }}></div>
      
      {/* Large decorative elements */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-[#2A9D8F]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 -left-40 w-96 h-96 bg-[#E9C46A]/5 rounded-full blur-3xl"></div>
      
      <div className="container relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1 bg-[#2A9D8F]/10 text-[#2A9D8F] rounded-full text-sm font-medium mb-4">Chef-Crafted</span>
          <h2 className="text-5xl font-bold text-[#2A9D8F] mb-4">Chef Developed Flavours</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Discover the delicious side of relief with OBEX, now available in three chef-inspired flavours.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {FLAVOR_DATA.map((flavor) => (
            <FlavorCard key={flavor.id} flavor={flavor} />
          ))}
        </div>
        
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-600 text-lg">Each flavour is crafted with care to provide an enjoyable taste experience. Say goodbye to the bland and medicinal, and hello to the delicious and natural with OBEX.</p>
          <div className="mt-12 inline-block flex gap-4 justify-center">
            <Link href="/products">
              <Button
                className="bg-[#2A9D8F] text-white hover:bg-[#238276] shadow-md hover:shadow-xl transition-all duration-300 px-8 py-4 rounded-lg text-lg font-medium transform hover:scale-105"
              >
                Explore Our Products
              </Button>
            </Link>
            <Button
              onClick={() => onScrollToSection('cta-section')}
              variant="outline"
              className="border-[#2A9D8F] text-[#2A9D8F] hover:bg-[#2A9D8F] hover:text-white shadow-md hover:shadow-xl transition-all duration-300 px-8 py-4 rounded-lg text-lg font-medium transform hover:scale-105"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlavourOptionsSection;