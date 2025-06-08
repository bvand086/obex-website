"use client";

import React from "react";
import Image from "next/image";

const ProductsBackground: React.FC = () => {
  return (
    <>
      {/* Main Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#2A9D8F]/5 rounded-full blur-3xl transform -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#E9C46A]/5 rounded-full blur-3xl transform translate-y-1/4 -translate-x-1/4"></div>
        
        {/* Additional product photography elements */}
        <div className="absolute top-1/4 right-1/4 w-32 h-48 transform rotate-12">
          <div className="w-full h-full bg-gradient-to-b from-[#2A9D8F]/8 to-transparent rounded-2xl">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-20 bg-white/10 rounded-full"></div>
          </div>
        </div>
        
        <div className="absolute bottom-1/3 right-1/6 w-24 h-36 transform -rotate-6">
          <div className="w-full h-full bg-gradient-to-b from-[#264653]/6 to-transparent rounded-2xl">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-16 bg-white/8 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Distributed Background Product Photography */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-5">
        {/* Product Photo 1 - Mint (Upper section) */}
        <div className="absolute -left-20 top-[20%] w-[28rem] h-[32rem] transform -rotate-12">
          <div className="relative w-full h-full rounded-3xl shadow-2xl opacity-35 overflow-hidden">
            <Image
              src="/studio_image_mint.png"
              alt="OBEX Mint Flavor Product Photography"
              fill
              className="object-cover object-center"
              priority={true}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2A9D8F]/5 to-transparent"></div>
          </div>
        </div>

        {/* Product Photo 2 - Lemon (Middle section) */}
        <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2 w-[32rem] h-[36rem] rotate-3">
          <div className="relative w-full h-full rounded-3xl shadow-2xl opacity-40 overflow-hidden">
            <Image
              src="/studio_image_lemon.png"
              alt="OBEX Lemon Flavor Product Photography"
              fill
              className="object-cover object-center"
              priority={true}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#E9C46A]/5 to-transparent"></div>
          </div>
        </div>

        {/* Product Photo 3 - Orange (Lower section) */}
        <div className="absolute -right-20 top-[70%] w-[28rem] h-[32rem] transform rotate-8">
          <div className="relative w-full h-full rounded-3xl shadow-2xl opacity-35 overflow-hidden">
            <Image
              src="/studio_image_orange.png"
              alt="OBEX Orange Flavor Product Photography"
              fill
              className="object-cover object-center"
              priority={true}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#264653]/5 to-transparent"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsBackground;