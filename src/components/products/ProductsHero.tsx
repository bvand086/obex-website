"use client";

import React from "react";
import Image from "next/image";

const ProductsHero: React.FC = () => {
  return (
    <div className="relative mb-16">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2A9D8F]/10 to-[#E9C46A]/10 rounded-2xl transform transition-transform duration-500"></div>
      <div className="relative bg-white/55 backdrop-blur-md p-12 rounded-2xl shadow-xl border border-[#2A9D8F]/10 overflow-hidden z-30">
        {/* Background Product Image */}
        <div className="absolute inset-0 opacity-40 flex flex-col">
          <Image
            src="/studio_image_medley.png"
            alt="OBEX Product Photography Medley"
            fill
            className="object-cover object-center"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/60 to-white/40"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <span className="inline-block px-4 py-1 bg-[#2A9D8F]/10 text-[#2A9D8F] rounded-full text-sm font-medium mb-4">Chef-Crafted</span>
          <h1 className="text-5xl font-bold mb-6 text-[#264653] leading-tight">
            OBEX Products
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
            Discover our complete range of natural heartburn relief products. 
            Each flavour is carefully crafted by chefs to provide both effective relief and an enjoyable taste experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductsHero;