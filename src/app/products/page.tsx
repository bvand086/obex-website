import React from 'react';
import ProductsBackground from '@/components/products/ProductsBackground';
import ProductsHero from '@/components/products/ProductsHero';
import FlavourCardsSection from '@/components/products/FlavourCardsSection';
import ProductInformation from '@/components/products/ProductInformation';
import BundleOptions from '@/components/products/BundleOptions';
import ProductsFooter from '@/components/products/ProductsFooter';

export default function Products() {
  return (
    <main className="min-h-screen relative bg-gradient-to-br from-[#FAFAF9] to-[#F4F6F6]">
      <ProductsBackground />

      {/* Main Content */}
      <section className="relative z-20 max-w-6xl mx-auto px-6 py-20">
        <ProductsHero />
        <FlavourCardsSection />
        <ProductInformation />
        <BundleOptions />
      </section>

      <ProductsFooter />
    </main>
  );
} 