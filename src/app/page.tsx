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
import { Instagram, Menu, X } from 'lucide-react';
import CartIcon from '@/components/CartIcon';
import AddToCartButton from '@/components/AddToCartButton';

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toast } = useToast()

  // CSS for timeline animation
  const timelineStyles = `
    [data-story-item] {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    [data-story-item].visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;

  useEffect(() => {
    setIsMounted(true);
    
    // Story scroll animation
    const handleScroll = () => {
      const progressBar = document.getElementById('story-progress-bar');
      const storyItems = document.querySelectorAll('[data-story-item]');
      const storySection = document.getElementById('story-content');
      
      if (progressBar && storyItems.length > 0 && storySection) {
        // Calculate story section position
        const storySectionRect = storySection.getBoundingClientRect();
        const storySectionTop = storySectionRect.top + window.scrollY;
        const storySectionHeight = storySectionRect.height;
        const storySectionBottom = storySectionTop + storySectionHeight;
        
        // Calculate how far down the page we've scrolled
        const scrollPosition = window.scrollY + window.innerHeight * 0.7;
        const scrollTop = window.scrollY;
        
        // Check if we're in the story section
        if (scrollTop <= storySectionBottom && (scrollTop + window.innerHeight) >= storySectionTop) {
          // Calculate progress percentage
          const totalScrollDistance = storySectionHeight + window.innerHeight;
          const currentScrollDistance = scrollTop + window.innerHeight - storySectionTop;
          const progressPercentage = Math.min(100, Math.max(0, (currentScrollDistance / totalScrollDistance) * 100));
          
          // Update progress bar
          progressBar.style.width = `${progressPercentage}%`;
          progressBar.style.opacity = '1';
        } else {
          // Hide progress bar when not in story section
          progressBar.style.opacity = scrollTop > storySectionBottom ? '0' : '1';
        }
        
        // Animate story items
        storyItems.forEach((item) => {
          const rect = item.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight * 0.8;
          
          if (isVisible) {
            item.classList.add('visible');
          }
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial call to set correct state on page load
    setTimeout(handleScroll, 100);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
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
    <main className="bg-[#FAFAF9] text-[#264653]">
      {/* Add timeline styles */}
      <style jsx global>{timelineStyles}</style>
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/OSlashLogo.png" alt="ØBEX Logo" width={40} height={40} />
            <span className="text-xl font-bold text-[#2A9D8F]">ØBEX</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => scrollToSection("product_details")} 
              className="px-4 py-2 text-[#2A9D8F] hover:text-[#264653] hover:bg-[#2A9D8F]/5 rounded-lg transition-all duration-300"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection("research")} 
              className="px-4 py-2 text-[#2A9D8F] hover:text-[#264653] hover:bg-[#2A9D8F]/5 rounded-lg transition-all duration-300"
            >
              Research
            </button>
            <Link 
              href="/blog" 
              className="px-4 py-2 text-[#2A9D8F] hover:text-[#264653] hover:bg-[#2A9D8F]/5 rounded-lg transition-all duration-300"
            >
              Blog
            </Link>
            <Dialog>
              <DialogTrigger asChild>
                <button className="px-4 py-2 text-[#2A9D8F] hover:text-[#264653] hover:bg-[#2A9D8F]/5 rounded-lg transition-all duration-300">
                  Feedback
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#e6dd58]/10 to-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-[#57a779]">Share Your Feedback</DialogTitle>
                </DialogHeader>
                <div className="w-full h-[800px]">
                  <iframe 
                    src="https://docs.google.com/forms/d/e/1FAIpQLScf_73CWJmfiTGnQtKa3m17wWDaFQiKcMTY9YAFObb5V3VfPQ/viewform?embedded=true" 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    className="w-full h-full"
                  >
                    Loading...
                  </iframe>
                </div>
              </DialogContent>
            </Dialog>
            <a 
              href="https://www.instagram.com/obexcanada/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-4 py-2 text-[#2A9D8F] hover:text-[#264653] transition-all duration-300"
              aria-label="Follow us on Instagram"
            >
              <Instagram size={24} />
            </a>
            <div className="flex items-center space-x-4">
              <CartIcon />
              <Link 
                href="/cart" 
                className="px-6 py-2 bg-[#E9C46A] text-[#264653] font-medium rounded-lg hover:bg-[#e0bb5e] transition-all duration-300 shadow-md hover:shadow-lg"
              >
                View Cart
              </Link>
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <button 
              className="text-[#2A9D8F] hover:text-[#264653] transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <CartIcon />
          </div>
        </nav>
        
        {/* Mobile menu */}
        <div className={`${
          isMenuOpen ? 'block' : 'hidden'
        } md:hidden bg-white/95 backdrop-blur-sm border-t`}>
          <div className="container mx-auto px-4 py-4 space-y-4">
            <button 
              onClick={() => { scrollToSection("product_details"); setIsMenuOpen(false); }}
              className="block w-full text-left px-4 py-2 text-[#2A9D8F] hover:text-[#264653] hover:bg-[#2A9D8F]/5 rounded-lg transition-all duration-300"
            >
              About
            </button>
            <button 
              onClick={() => { scrollToSection("research"); setIsMenuOpen(false); }}
              className="block w-full text-left px-4 py-2 text-[#2A9D8F] hover:text-[#264653] hover:bg-[#2A9D8F]/5 rounded-lg transition-all duration-300"
            >
              Research
            </button>
            <Link 
              href="/blog"
              onClick={() => setIsMenuOpen(false)}
              className="block w-full text-left px-4 py-2 text-[#2A9D8F] hover:text-[#264653] hover:bg-[#2A9D8F]/5 rounded-lg transition-all duration-300"
            >
              Blog
            </Link>
            <Dialog>
              <DialogTrigger asChild>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-left px-4 py-2 text-[#2A9D8F] hover:text-[#264653] hover:bg-[#2A9D8F]/5 rounded-lg transition-all duration-300"
                >
                  Feedback
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#e6dd58]/10 to-white">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-[#57a779]">Share Your Feedback</DialogTitle>
                </DialogHeader>
                <div className="w-full h-[800px]">
                  <iframe 
                    src="https://docs.google.com/forms/d/e/1FAIpQLScf_73CWJmfiTGnQtKa3m17wWDaFQiKcMTY9YAFObb5V3VfPQ/viewform?embedded=true" 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    className="w-full h-full"
                  >
                    Loading...
                  </iframe>
                </div>
              </DialogContent>
            </Dialog>
            <div className="flex items-center justify-between px-4 py-2">
              <a 
                href="https://www.instagram.com/obexcanada/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#2A9D8F] hover:text-[#264653] transition-all duration-300"
                aria-label="Follow us on Instagram"
                onClick={() => setIsMenuOpen(false)}
              >
                <Instagram size={24} />
              </a>
              <Link 
                href="/cart"
                onClick={() => setIsMenuOpen(false)}
                className="px-6 py-2 bg-[#E9C46A] text-[#264653] font-medium rounded-lg hover:bg-[#e0bb5e] transition-all duration-300 shadow-md hover:shadow-lg"
              >
                View Cart
              </Link>
            </div>
          </div>
        </div>
      </header>

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

      {/* Our Story Section */}
      <section className="bg-gradient-to-b from-[#FAFAF9] to-[#F0F0E8] py-20 overflow-hidden relative">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#2A9D8F]/10 blur-3xl"></div>
          <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-[#F4A261]/10 blur-3xl"></div>
          <div className="absolute -bottom-20 left-1/4 w-72 h-72 rounded-full bg-[#E9C46A]/10 blur-3xl"></div>
        </div>
        
        {/* Progress bar that follows scroll */}
        <div className="fixed top-0 left-0 w-full h-1 z-50 pointer-events-none">
          <div id="story-progress-bar" className="h-full bg-gradient-to-r from-[#2A9D8F] to-[#F4A261] w-0 transition-all duration-300"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-5xl font-bold text-center text-[#2A9D8F] mb-4 relative">
              Our Story
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-[#F4A261]"></div>
            </h2>
            <p className="text-xl text-gray-600 text-center max-w-2xl">The journey behind creating Canada's most enjoyable sodium alginate blend</p>
          </div>
          
          <div id="story-content" className="space-y-12">
            <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-[1.02] transition-all duration-300 border-l-4 border-[#2A9D8F] opacity-0 translate-y-8" data-story-item>
              <p className="text-gray-700 leading-relaxed">OBEX was founded by a collaborative team—a laryngologist, a speech-language pathologist, a food scientist, and a professional chef—in Hamilton, Ontario, Canada. The inspiration for OBEX emerged from a unique clinical need identified during the laryngologist's fellowship training at the University of Southern California in Los Angeles, where sodium alginate therapy was frequently recommended for patients managing LPR, reflux, and regurgitation symptoms. Sodium alginate therapy offered significant relief—either alone or alongside proton pump inhibitors.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-[1.02] transition-all duration-300 border-l-4 border-[#2A9D8F] opacity-0 translate-y-8" data-story-item>
              <p className="text-gray-700 leading-relaxed">After returning to Ontario, the team recognized a significant barrier for patients: existing sodium alginate products available in Canada often had tastes and textures that many patients found challenging. Additionally, importing alternative products from the United States was financially impractical due to high costs related to import fees, currency exchange, and shipping.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-[1.02] transition-all duration-300 border-l-4 border-[#2A9D8F] opacity-0 translate-y-8" data-story-item>
              <p className="text-gray-700 leading-relaxed">Recognizing this unmet need, the team leveraged their combined medical, culinary, and scientific expertise to develop their own sodium alginate blend. With the chef's culinary creativity and the food scientist's expertise, they developed an alginate blend with appealing and soothing flavours such as Mint, Lemon Meringue, and Orange Cream. After thorough internal testing, sample packets were distributed to selected individuals.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-[1.02] transition-all duration-300 border-l-4 border-[#F4A261] opacity-0 translate-y-8" data-story-item>
              <p className="text-gray-700 leading-relaxed">The response was overwhelmingly positive. Patients reported effective symptom relief and genuinely enjoyed the taste, which reinforced the team's confidence in the product.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-[1.02] transition-all duration-300 border-l-4 border-[#F4A261] opacity-0 translate-y-8" data-story-item>
              <p className="text-gray-700 leading-relaxed">Inspired by this feedback, the team officially created OBEX—a name derived from the Latin word meaning "barrier," symbolizing the protective property of sodium alginate. Today, OBEX remains committed to offering Canadians a high-quality, enjoyable-tasting sodium alginate blend crafted with care by medical, culinary, and scientific experts.</p>
            </div>
          </div>
          
          {/* Team illustration */}
          <div className="mt-16 flex justify-center">
            <div className="bg-black p-6 rounded-full shadow-lg transform hover:rotate-3 transition-all duration-500 inline-flex">
              <Image 
                src="/white_transparent_OSlashLogo.png" 
                alt="OBEX Team" 
                width={80} 
                height={80} 
                className="object-contain"
              />
            </div>
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

      {/* Research Section */}
      <section id="research" className="relative py-24 overflow-hidden bg-gradient-to-b from-white to-[#F4F6F6]">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#2A9D8F]/5 rounded-full blur-3xl transform -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#E9C46A]/5 rounded-full blur-3xl transform translate-y-1/4 -translate-x-1/4"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-[#2A9D8F]/10 text-[#2A9D8F] rounded-full text-sm font-medium mb-4">Evidence-Based</span>
            <h2 className="text-5xl font-bold text-[#2A9D8F] mb-4">Medical Research Support</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Discover the scientific evidence behind OBEX's effectiveness in managing reflux symptoms.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* First Research Card */}
            <div className="group relative h-[450px]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2A9D8F]/20 to-[#E9C46A]/20 rounded-2xl transform transition-transform duration-500 group-hover:scale-[0.98]"></div>
              <div className="absolute -inset-0.5 bg-gradient-to-br from-[#2A9D8F] to-[#E9C46A] opacity-20 rounded-2xl blur group-hover:opacity-30 transition duration-500"></div>
              <a 
                href="https://pubmed.ncbi.nlm.nih.gov/30487493/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block h-full"
              >
                <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl transition-all duration-500 group-hover:shadow-2xl border border-[#2A9D8F]/10 h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2A9D8F] to-[#E9C46A] flex items-center justify-center transform transition-transform duration-500 group-hover:rotate-12">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#2A9D8F] group-hover:text-[#264653] transition-colors duration-300">Comparative Study: Alginate vs. Omeprazole</h3>
                  </div>

                  <div className="space-y-4 flex-grow">
                    <p className="text-gray-600 leading-relaxed">This study compared the effectiveness of sodium alginate and omeprazole in treating heartburn, demonstrating comparable efficacy between the two treatments.</p>
                    
                    <div className="bg-[#2A9D8F]/5 p-4 rounded-lg">
                      <h4 className="font-semibold text-[#2A9D8F] mb-2">Key Findings:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center text-gray-600">
                          <span className="w-2 h-2 rounded-full bg-[#2A9D8F] mr-2"></span>
                          Similar effectiveness to omeprazole
                        </li>
                        <li className="flex items-center text-gray-600">
                          <span className="w-2 h-2 rounded-full bg-[#2A9D8F] mr-2"></span>
                          Rapid symptom relief
                        </li>
                        <li className="flex items-center text-gray-600">
                          <span className="w-2 h-2 rounded-full bg-[#2A9D8F] mr-2"></span>
                          Well-tolerated by patients
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-auto">
                    <span className="text-sm text-gray-500">Published in MMJ, 2018</span>
                    <div className="inline-flex items-center text-[#2A9D8F] hover:text-[#264653] transition-colors duration-300">
                      Read More
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            </div>

            {/* Second Research Card */}
            <div className="group relative h-[450px]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#E9C46A]/20 to-[#2A9D8F]/20 rounded-2xl transform transition-transform duration-500 group-hover:scale-[0.98]"></div>
              <div className="absolute -inset-0.5 bg-gradient-to-br from-[#E9C46A] to-[#2A9D8F] opacity-20 rounded-2xl blur group-hover:opacity-30 transition duration-500"></div>
              <a 
                href="https://pubmed.ncbi.nlm.nih.gov/30466131/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block h-full"
              >
                <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl transition-all duration-500 group-hover:shadow-2xl border border-[#E9C46A]/10 h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E9C46A] to-[#2A9D8F] flex items-center justify-center transform transition-transform duration-500 group-hover:rotate-12">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#E9C46A] group-hover:text-[#264653] transition-colors duration-300">Alginate as Add-on Therapy</h3>
                  </div>

                  <div className="space-y-4 flex-grow">
                    <p className="text-gray-600 leading-relaxed">This study investigated the effectiveness of adding alginate to existing PPI treatment in patients with persistent GERD symptoms.</p>
                    
                    <div className="bg-[#E9C46A]/5 p-4 rounded-lg">
                      <h4 className="font-semibold text-[#E9C46A] mb-2">Key Findings:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start text-gray-600">
                          <span className="w-2 h-2 rounded-full bg-[#E9C46A] mr-2 mt-1.5"></span>
                          <span>72% of patients reported improved satisfaction with alginate</span>
                        </li>
                        <li className="flex items-start text-gray-600">
                          <span className="w-2 h-2 rounded-full bg-[#E9C46A] mr-2 mt-1.5"></span>
                          <span>Significant reduction in nighttime symptoms</span>
                        </li>
                        <li className="flex items-start text-gray-600">
                          <span className="w-2 h-2 rounded-full bg-[#E9C46A] mr-2 mt-1.5"></span>
                          <span>GERD-Q scores improved from 10.7 to 8.7</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-auto">
                    <span className="text-sm text-gray-500">Published in DMW, 2018</span>
                    <div className="inline-flex items-center text-[#E9C46A] hover:text-[#264653] transition-colors duration-300">
                      Read More
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-600 text-lg mb-8">Our commitment to evidence-based solutions drives continuous research and development.</p>
            <button 
              onClick={() => scrollToSection('cta-section')}
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-[#2A9D8F] to-[#264653] text-white rounded-lg hover:from-[#264653] hover:to-[#2A9D8F] transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Try OBEX Today
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
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

      {/* Flavour Options Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAFA] to-[#E9EDe9] z-0"></div>
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
            {/* Mint Flavor Card */}
            <div className="flavor-card group h-[520px] relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl transform transition-transform duration-500 group-hover:scale-[0.98]"></div>
              <div className="absolute -inset-0.5 bg-gradient-to-br from-green-200 to-green-400 opacity-50 rounded-2xl blur-sm group-hover:opacity-80 transition duration-500"></div>
              <div className="relative flex flex-col h-full bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-green-200/50 shadow-xl transition-all duration-500 group-hover:shadow-green-200/40 overflow-hidden">
                {/* Top decorative accent */}
                <div className="absolute top-0 left-0 w-40 h-40 bg-green-500/10 rounded-br-[100px] -translate-x-10 -translate-y-10 blur-md"></div>
                <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-green-300 opacity-70 blur-md"></div>
                
                {/* Flavor icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center transform transition-transform duration-500 group-hover:rotate-12">
                    <Image 
                      src="/white_transparent_OSlashLogo.png" 
                      alt="Mint Flavor" 
                      width={40} 
                      height={40} 
                      className="object-contain"
                    />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-center text-green-700 mb-4">Refreshing Mint</h3>
                
                <div className="relative flex-grow overflow-hidden">
                  <div className="h-[180px] flex items-center">
                    <p className="text-gray-700 leading-relaxed transform transition-transform duration-500 group-hover:translate-y-[-8px] opacity-100 group-hover:opacity-0">Experience the crisp and invigorating taste of refreshing mint. This classic flavour not only soothes your senses but also provides a cooling comforting sensation.</p>
                  </div>

                  {/* Hover details */}
                  <div className="absolute inset-0 flex flex-col justify-center transform transition-all duration-500 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="text-green-700 font-semibold mb-2">Perfect For:</span>
                    <ul className="text-gray-700 text-sm mb-4">
                      <li className="flex items-center mb-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        After meals with strong flavors
                      </li>
                      <li className="flex items-center mb-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        When you want a cool sensation
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        A refreshing daytime option
                      </li>
                    </ul>
                    <AddToCartButton
                      priceId="price_YOUR_MINT_PRICE_ID"
                      flavor="Refreshing Mint"
                      className="mt-4 mx-auto px-6 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                    />
                  </div>
                </div>
                
                {/* Bottom accent */}
                <div className="mt-auto flex justify-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-green-300 to-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Lemon Meringue Flavor Card */}
            <div className="flavor-card group h-[520px] relative mt-0">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl transform transition-transform duration-500 group-hover:scale-[0.98]"></div>
              <div className="absolute -inset-0.5 bg-gradient-to-br from-yellow-200 to-yellow-400 opacity-50 rounded-2xl blur-sm group-hover:opacity-80 transition duration-500"></div>
              <div className="relative flex flex-col h-full bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-yellow-200/50 shadow-xl transition-all duration-500 group-hover:shadow-yellow-200/40 overflow-hidden">
                {/* Top decorative accent */}
                <div className="absolute top-0 left-0 w-40 h-40 bg-yellow-500/10 rounded-br-[100px] -translate-x-10 -translate-y-10 blur-md"></div>
                <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-300 opacity-70 blur-md"></div>
                
                {/* Flavor icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center transform transition-transform duration-500 group-hover:rotate-12">
                    <Image 
                      src="/white_transparent_OSlashLogo.png" 
                      alt="Lemon Flavor" 
                      width={40} 
                      height={40} 
                      className="object-contain"
                    />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-center text-yellow-700 mb-4">Lemon Meringue</h3>
                
                <div className="relative flex-grow overflow-hidden">
                  <div className="h-[180px] flex items-center">
                    <p className="text-gray-700 leading-relaxed transform transition-transform duration-500 group-hover:translate-y-[-8px] opacity-100 group-hover:opacity-0">Indulge in the delightful tang of lemon meringue, reminiscent of a classic dessert. The perfect balance of zesty lemon and sweet meringue creates a delectable treat that will brighten your day while keeping you comfortable.</p>
                  </div>

                  {/* Hover details */}
                  <div className="absolute inset-0 flex flex-col justify-center transform transition-all duration-500 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="text-yellow-700 font-semibold mb-2">Perfect For:</span>
                    <ul className="text-gray-700 text-sm mb-4">
                      <li className="flex items-center mb-1">
                        <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                        After citrus or acidic meals
                      </li>
                      <li className="flex items-center mb-1">
                        <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                        When you need a mood boost
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                        A bright morning option
                      </li>
                    </ul>
                    <AddToCartButton
                      priceId="price_YOUR_LEMON_PRICE_ID"
                      flavor="Lemon Meringue"
                      className="mt-4 mx-auto px-6 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                    />
                  </div>
                </div>
                
                {/* Bottom accent */}
                <div className="mt-auto flex justify-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full"></div>
                </div>
              </div>
            </div>
            
            {/* Orange Cream Flavor Card */}
            <div className="flavor-card group h-[520px] relative mt-0">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl transform transition-transform duration-500 group-hover:scale-[0.98]"></div>
              <div className="absolute -inset-0.5 bg-gradient-to-br from-orange-200 to-orange-400 opacity-50 rounded-2xl blur-sm group-hover:opacity-80 transition duration-500"></div>
              <div className="relative flex flex-col h-full bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-orange-200/50 shadow-xl transition-all duration-500 group-hover:shadow-orange-200/40 overflow-hidden">
                {/* Top decorative accent */}
                <div className="absolute top-0 left-0 w-40 h-40 bg-orange-500/10 rounded-br-[100px] -translate-x-10 -translate-y-10 blur-md"></div>
                <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-orange-300 opacity-70 blur-md"></div>
                
                {/* Flavor icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center transform transition-transform duration-500 group-hover:rotate-12">
                    <Image 
                      src="/white_transparent_OSlashLogo.png" 
                      alt="Orange Flavor" 
                      width={40} 
                      height={40} 
                      className="object-contain"
                    />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-center text-orange-700 mb-4">Orange Cream</h3>
                
                <div className="relative flex-grow overflow-hidden">
                  <div className="h-[180px] flex items-center">
                    <p className="text-gray-700 leading-relaxed transform transition-transform duration-500 group-hover:translate-y-[-8px] opacity-100 group-hover:opacity-0">Savour the nostalgic blend of creamy vanilla and bright orange with our orange creamsicle flavour. This comforting and luscious option takes you back to childhood summers, offering a soothing and enjoyable way to manage reflux.</p>
                  </div>

                  {/* Hover details */}
                  <div className="absolute inset-0 flex flex-col justify-center transform transition-all duration-500 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="text-orange-700 font-semibold mb-2">Perfect For:</span>
                    <ul className="text-gray-700 text-sm mb-4">
                      <li className="flex items-center mb-1">
                        <span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
                        After spicy meals
                      </li>
                      <li className="flex items-center mb-1">
                        <span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
                        When seeking comfort
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
                        A soothing evening option
                      </li>
                    </ul>
                    <AddToCartButton
                      priceId="price_YOUR_ORANGE_PRICE_ID"
                      flavor="Orange Cream"
                      className="mt-4 mx-auto px-6 py-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                    />
                  </div>
                </div>
                
                {/* Bottom accent */}
                <div className="mt-auto flex justify-center">
                  <div className="w-16 h-1 bg-gradient-to-r from-orange-300 to-orange-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600 text-lg">Each flavour is crafted with care to provide an enjoyable taste experience. Say goodbye to the bland and medicinal, and hello to the delicious and natural with OBEX.</p>
            <div className="mt-12 inline-block">
              <Button
                onClick={() => scrollToSection('cta-section')}
                className="bg-[#2A9D8F] text-white hover:bg-[#238276] shadow-md hover:shadow-xl transition-all duration-300 px-8 py-4 rounded-lg text-lg font-medium transform hover:scale-105"
              >
                Explore Our Products
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta-section" className="bg-[#2A9D8F] text-white py-16">
        <div className="max-w-2xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Card className="mb-8 bg-white text-gray-900 overflow-hidden rounded-xl shadow-lg">
            <div className="relative">
              {/* Full gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#2A9D8F] to-[#E9B949]"></div>
              
              {/* White content area with diagonal cut - more transparent */}
              <div className="absolute top-[240px] left-0 right-0 bottom-0 bg-white/95" style={{ clipPath: "polygon(0 0, 100% 60px, 100% 100%, 0 100%)" }}></div>
              
              {/* Cream colored bottom area with diagonal cut - more transparent */}
              <div className="absolute bottom-0 left-0 right-0 h-[180px] bg-[#fff9e6]/90" style={{ clipPath: "polygon(0 60px, 100% 0, 100% 100%, 0 100%)" }}></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Header content */}
                <div className="pt-12 pb-20 px-6 text-center">
                  <div className="inline-block px-6 py-2 bg-white/90 rounded-full text-[#2A9D8F] font-semibold mb-6 shadow-sm backdrop-blur-sm">
                    Just Launched!
                  </div>
                  <h2 className="text-5xl font-bold text-white mb-2">New Bottle Format</h2>
                  <p className="text-2xl text-white">Now Available!</p>
                </div>
                
                {/* Product image in white area */}
                <div className="bg-white/90 backdrop-blur-sm mx-auto w-4/5 max-w-[600px] -mt-4 pt-4 pb-8 rounded-t-xl">
                  <Image 
                    src="/OBEXTUBE.jpg" 
                    alt="New OBEX bottle" 
                    width={500} 
                    height={500} 
                    className="mx-auto" 
                  />
                </div>
                
                {/* Flavor text in cream area */}
                <div className="relative bg-[#fff9e6]/90 backdrop-blur-sm pt-4 pb-16 px-8 text-center">
                  <p className="text-[#8B4513] text-lg mb-12">
                    Experience OBEX in three chef-inspired flavours:
                    <br />
                    <span className="font-medium">Orange Cream</span> • <span className="font-medium">Lemon Meringue</span> • <span className="font-medium">Refreshing Mint</span>
                  </p>
                  
                  {/* Purchase button */}
                  <AddToCartButton
                    priceId="price_YOUR_DEFAULT_PRICE_ID"
                    flavor="Refreshing Mint"
                    className="absolute left-1/2 transform -translate-x-1/2 px-10 py-4 bg-[#E9C46A] text-[#264653] text-lg font-semibold rounded-lg hover:bg-[#e0bb5e] transition-all duration-300 shadow-md hover:shadow-xl text-center min-w-[200px]"
                  />
                </div>
                
                {/* Footer */}
                <div className="bg-white/90 backdrop-blur-sm p-6 text-center">
                  <p className="text-[#2A9D8F] text-lg italic">Experience the new OBEX – Available now!</p>
                </div>
              </div>
            </div>
          </Card>
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