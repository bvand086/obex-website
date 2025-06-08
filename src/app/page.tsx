"use client";

import CustomerReviews from '@/app/customerReview';
import { useToast } from "@/components/ui/use-toast";
import React, { useState, useEffect } from "react";
import HeroSection from '@/components/HeroSection';
import FlavourOptionsSection from '@/components/FlavourOptionsSection';
import CTASection from '@/components/CTASection';
import ProductDetailsSection from '@/components/ProductDetailsSection';
import CanadaSection from '@/components/CanadaSection';
import Footer from '@/components/Footer';


export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast()

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollToSection = (id: string): void => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    } else {
      console.error(`Section with ID ${id} not found.`);
    }
  };
  
  if (!isMounted) {
    return null;
  }

  return (
    <main className="bg-[#FAFAF9] text-[#264653] pt-20">
      <HeroSection onScrollToSection={scrollToSection} />
      <FlavourOptionsSection onScrollToSection={scrollToSection} />
      <CTASection onScrollToSection={scrollToSection} />
      <CustomerReviews />
      <ProductDetailsSection />
      <CanadaSection onScrollToSection={scrollToSection} />
      <Footer />
    </main>
  );
}