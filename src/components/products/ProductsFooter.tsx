"use client";

import React from "react";
import Link from 'next/link';
import Image from 'next/image';

const ProductsFooter: React.FC = () => {
  return (
    <footer className="relative z-20 bg-[#264653] text-white py-12">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="mb-8">
          <Image 
            src="/white_transparent_OSlashLogo.png" 
            alt="OBEX Logo" 
            width={48} 
            height={48} 
            className="mx-auto mb-4"
          />
          <p className="text-2xl font-bold text-white mb-2">OBEX</p>
        </div>
        
        <p className="mb-4 text-gray-300">
          Contact us: <a href="mailto:support@obexcanada.com" className="text-[#2A9D8F] hover:text-[#E9C46A] transition-colors">support@obexcanada.com</a>
        </p>
        
        <div className="flex justify-center gap-4 mb-8">
          <Link 
            href="/" 
            className="text-[#2A9D8F] hover:text-[#E9C46A] transition-colors inline-flex items-center gap-2"
          >
            <span>Back to Home</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
          <Link 
            href="/blog" 
            className="text-[#2A9D8F] hover:text-[#E9C46A] transition-colors inline-flex items-center gap-2"
          >
            <span>Read Our Blog</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </Link>
        </div>
        
        <div className="border-t border-gray-700 pt-8">
          <p className="text-sm text-gray-400 mb-4">© 2024 OBEX Corporation. All rights reserved.</p>
          <p className="text-xs text-gray-500 max-w-xl mx-auto">
            These statements have not been evaluated by Health Canada. This product is not intended to diagnose, treat, cure, or prevent any disease. Consult a healthcare practitioner prior to use if you have a medical condition or are taking medications.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default ProductsFooter;