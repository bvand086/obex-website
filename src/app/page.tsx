"use client";

import CustomerReviews from '@/app/customerReview';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import AddToCartButton from '@/components/AddToCartButton';
import FlavorCard from '@/components/FlavorCard';
import { FLAVOR_DATA } from '@/lib/flavorData';

interface ControlInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

const ControlInput: React.FC<ControlInputProps> = ({ label, value, onChange, min, max }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startValueRef = useRef<number>(value);

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    startXRef.current = clientX;
    startValueRef.current = value;
  };

  const handleMove = (clientX: number) => {
    if (isDragging) {
      const sensitivity = 0.5;
      const delta = (clientX - startXRef.current) * sensitivity;
      const range = max - min;
      const newValue = Math.round(startValueRef.current + (delta / 100) * range);
      onChange(Math.max(min, Math.min(max, newValue)));
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
    const handleMouseUp = handleEnd;
    const handleTouchEnd = handleEnd;

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, min, max, onChange]);

  return (
    <div className="flex items-center mr-4 mb-2">
      <label className="mr-2 text-gray-500 font-mono text-xs">{label}</label>
      <div
        ref={inputRef}
        className={`w-12 text-center py-1 text-gray-500 font-mono text-xs cursor-ew-resize select-none ${
          isDragging ? 'text-white' : ''
        }`}
        onMouseDown={(e) => handleStart(e.clientX)}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      >
        {value}
      </div>
    </div>
  );
};

interface MousePosition {
  x: number;
  y: number;
}

const RotatingLinesGrid: React.FC = () => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [horizontalSeparation] = useState(30);
  const [verticalSeparation] = useState(30);
  const [lineWidth] = useState(25);
  const [lineHeight] = useState(2);
  const [rows] = useState(10);
  const [columns] = useState(20);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
        const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
        setMousePosition({
          x: clientX - rect.left,
          y: clientY - rect.top
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleMouseMove as EventListener);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove as EventListener);
    };
  }, []);

  const calculateRotationAndColor = (lineX: number, lineY: number) => {
    const dx = mousePosition.x - lineX;
    const dy = mousePosition.y - lineY;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const distance = Math.sqrt(dx * dx + dy * dy);
    return { angle, distance };
  };

  const getColor = (distance: number) => {
    const maxDistance = Math.sqrt(
      (containerRef.current?.clientWidth || 0) ** 2 + 
      (containerRef.current?.clientHeight || 0) ** 2
    ) || 500;
    const intensity = Math.max(0, 1 - distance / (maxDistance * 0.3));
    const r = Math.round(244 + (233 - 244) * intensity);
    const g = Math.round(162 + (196 - 162) * intensity);
    const b = Math.round(97 + (106 - 97) * intensity);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, ${lineWidth}px)`,
    gridTemplateRows: `repeat(${rows}, ${lineHeight}px)`,
    gap: `${verticalSeparation}px ${horizontalSeparation}px`,
    padding: '20px',
    backgroundColor: 'transparent',
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 0,
  };

  return (
    <div 
      ref={containerRef} 
      style={gridStyle}
      onTouchMove={(e) => e.preventDefault()}
    >
      {Array.from({ length: rows * columns }).map((_, index) => {
        const row = Math.floor(index / columns);
        const col = index % columns;
        const lineX = col * (lineWidth + horizontalSeparation) + lineWidth / 2;
        const lineY = row * (lineHeight + verticalSeparation) + lineHeight / 2;
        const rotationAndColor = calculateRotationAndColor(lineX, lineY);

        return (
          <div
            key={index}
            style={{
              width: `${lineWidth}px`,
              height: `${lineHeight}px`,
              backgroundColor: getColor(rotationAndColor.distance),
              transform: `rotate(${rotationAndColor.angle}deg)`,
              transformOrigin: 'center',
              transition: 'transform 0.1s ease-out, background-color 0.1s ease-out',
            }}
          />
        );
      })}
    </div>
  );
};

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    <main className="bg-[#FAFAF9] text-[#264653] pt-20">{/* Padding top for fixed header */}
      


      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen py-16 px-4 bg-gradient-to-b from-[#F4A261] to-[#E9C46A] text-white overflow-hidden">
        <RotatingLinesGrid />
        <div className="max-w-xs sm:max-w-2xl text-center mx-auto relative z-10">
          <h2 className="mb-4 text-4xl sm:text-5xl font-bold text-green-800">Experience the Power of</h2>
          <h1 className="mb-4 text-6xl sm:text-[10rem] font-extrabold text-green-800 tracking-widest">ØBEX</h1>
          <p className="mb-8 text-lg sm:text-xl text-green-600">Your Natural Barrier Against Heartburn</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="w-full sm:w-auto px-6 py-2 bg-[#E9C46A] text-[#264653] font-medium rounded-lg hover:bg-[#e0bb5e] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105" onClick={() => scrollToSection('cta-section')}>
              Buy Now
            </Button>
            <button className="w-full sm:w-auto px-6 py-2 border-2 border-[#2A9D8F] text-[#2A9D8F] font-medium rounded-lg hover:bg-[#2A9D8F]/10 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105" onClick={() => scrollToSection('product_details')}>
              Learn More
            </button>
          </div>
        </div>
      </section>



      {/* Flavour Options Section */}
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
                onClick={() => scrollToSection('cta-section')}
                variant="outline"
                className="border-[#2A9D8F] text-[#2A9D8F] hover:bg-[#2A9D8F] hover:text-white shadow-md hover:shadow-xl transition-all duration-300 px-8 py-4 rounded-lg text-lg font-medium transform hover:scale-105"
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
            <Button 
              onClick={() => scrollToSection('product_details')}
              className="px-8 py-3 bg-white text-[#2A9D8F] font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-xl"
            >
              Learn More About OBEX
            </Button>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <CustomerReviews />

      {/* Product Details */}
      <section id="product_details" className="bg-[#E9EDe9] py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#2A9D8F] mb-4">About Sodium Alginate</h2>
          <p className="mb-8 text-gray-700">Sodium alginate, a natural substance derived from seaweed, has become an increasingly popular ingredient in products aimed at managing gastroesophageal reflux disease (GERD) and heartburn. The unique properties of sodium alginate make it especially effective for relieving these common digestive issues.</p>
          
          <h3 className="text-2xl font-bold mb-4 text-green-600">How Sodium Alginate Works</h3>
          <p className="mb-8 text-gray-700">When ingested, sodium alginate reacts with stomach acid to form a gel-like raft that floats on top of the stomach contents. This raft acts as a barrier, preventing acid from rising back up into the esophagus, which is the cause of heartburn and other reflux-related discomfort.</p>
          
          <h3 className="text-2xl font-bold mb-4 text-green-600">Why Sodium Alginate is Beneficial</h3>
          <ul className="list-disc pl-5 mb-8 text-gray-700">
            <li className="mb-2"><strong className="text-green-700">Rapid Relief:</strong> Sodium alginate works quickly to form a protective barrier, often providing immediate relief from heartburn.</li>
            <li className="mb-2"><strong className="text-green-700">Natural and Safe:</strong> As a natural extract from seaweed, sodium alginate is generally well-tolerated and considered safe for most people, including pregnant women.</li>
            <li className="mb-2"><strong className="text-green-700">Non-Systemic Action:</strong> Unlike proton pump inhibitors or other acid-suppressing medications, sodium alginate does not affect the overall acidity of the stomach.</li>
            <li className="mb-2"><strong className="text-green-700">Complementary to Other Treatments:</strong> Sodium alginate can be used alongside other treatments for GERD or heartburn.</li>
          </ul>
        </div>
      </section>



      {/* Made in Canada Section */}
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
            <button className="px-6 py-2 bg-[#2A9D8F] text-white rounded-lg hover:bg-[#238276] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105" onClick={() => scrollToSection("product_details")}>
              Learn More
            </button>
            <button className="px-6 py-2 bg-[#E9C46A] text-[#264653] font-medium rounded-lg hover:bg-[#e0bb5e] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105" onClick={() => scrollToSection("cta-section")}>
              Buy Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#264653] text-white py-8">
        <div className="max-w-2xl mx-auto text-center">
          <p className="mb-2">© 2025 OBEX Corporation. All rights reserved.</p>
          <p className="text-sm text-green-300">
            Contact us: <a href="mailto:support@obexcanada.com" className="hover:text-green-100 transition-colors">support@obexcanada.com</a>
          </p>
          <p className="text-xs text-gray-400 max-w-xl mx-auto mt-4">
            These statements have not been evaluated by Health Canada. This product is not intended to diagnose, treat, cure, or prevent any disease. Consult a healthcare practitioner prior to use if you have a medical condition or are taking medications.
          </p>
        </div>
      </footer>
    </main>
  );
}