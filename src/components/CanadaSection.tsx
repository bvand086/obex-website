"use client";

import React from "react";
import Image from "next/image";

interface CanadaSectionProps {
  onScrollToSection: (id: string) => void;
}

const CanadaSection: React.FC<CanadaSectionProps> = ({ onScrollToSection }) => {
  return (
    <section className="bg-[#F4A261] text-white py-16">
      <div className="max-w-2xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <Image src="/canada_white_lines.png" alt="Canada" width={300} height={300} className="mx-auto mb-8" />
        <h2 className="text-4xl font-bold mb-4 text-white">
          <span className="text-red-500">Developed</span> Right Here in <span className="text-red-500">Canada 🇨🇦</span>
        </h2>
        <p className="mb-8 text-gray-700">
          Crafted in Hamilton, Ontario, OBEX is the result of a groundbreaking collaboration among an ENT Surgeon, a Speech-Language Pathologist, a Chef, and a Food Scientist. Born from the desire to offer a palatable, natural alternative to traditional reflux remedies, OBEX combines a rich legacy of scientific knowledge with culinary innovation.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="px-6 py-2 bg-[#2A9D8F] text-white rounded-lg hover:bg-[#238276] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105" onClick={() => onScrollToSection("product_details")}>
            Learn More
          </button>
          <button className="px-6 py-2 bg-[#E9C46A] text-[#264653] font-medium rounded-lg hover:bg-[#e0bb5e] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105" onClick={() => onScrollToSection("cta-section")}>
            Buy Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default CanadaSection;