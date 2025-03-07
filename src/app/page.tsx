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
    <main className="bg-[#FAFAF9] text-[#264653]">
      {/* Header */}
      <header className="relative flex flex-col sm:flex-row items-center justify-between p-4 bg-gradient-to-r from-[#e6dd58] via-[#dda742] to-[#57a779] max-w-full mx-auto">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-black">
              <Image src="/white_transparent_OSlashLogo.png" alt="OBEX Logo" width={28} height={28} className="object-cover" />
            </div>
            <h1 className="text-2xl font-bold text-white">OBEX</h1>
          </div>
          <button 
            className="sm:hidden text-white hover:text-[#e6dd58] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        <nav className={`${
          isMenuOpen ? 'flex' : 'hidden'
        } sm:flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-4 sm:mt-0 ${
          isMenuOpen ? 'absolute top-full left-0 right-0 bg-gradient-to-r from-[#e6dd58] via-[#dda742] to-[#57a779] p-4 z-50' : ''
        }`}>
          <a href="#" className="w-full sm:w-auto text-center px-4 py-2 text-white hover:text-[#e6dd58] hover:bg-black/10 rounded transition-colors" onClick={(e) => { e.preventDefault(); scrollToSection("product_details"); setIsMenuOpen(false); }}>
            About
          </a>
          <a href="#research" className="w-full sm:w-auto text-center px-4 py-2 text-white hover:text-[#e6dd58] hover:bg-black/10 rounded transition-colors" onClick={(e) => { e.preventDefault(); scrollToSection("research"); setIsMenuOpen(false); }}>
            Research
          </a>
          <Link href="/blog" className="w-full sm:w-auto text-center px-4 py-2 text-white hover:text-[#e6dd58] hover:bg-black/10 rounded transition-colors" onClick={() => setIsMenuOpen(false)}>
            Blog
          </Link>
          <Dialog>
            <DialogTrigger asChild>
              <button className="w-full sm:w-auto text-center px-4 py-2 text-white hover:text-[#e6dd58] hover:bg-black/10 rounded transition-colors" onClick={() => setIsMenuOpen(false)}>
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
            className="w-full sm:w-auto text-center px-4 py-2 text-white hover:text-[#e6dd58] transition-colors flex items-center justify-center"
            aria-label="Follow us on Instagram"
            onClick={() => setIsMenuOpen(false)}
          >
            <Instagram size={24} />
          </a>
          <button 
            className="w-full sm:w-auto text-center px-4 py-2 bg-[#57a779] text-white rounded hover:bg-[#4a8f68] transition-colors border-2 border-white" 
            onClick={() => { scrollToSection("cta-section"); setIsMenuOpen(false); }}
          >
            Buy Now
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen py-16 px-4 bg-gradient-to-b from-[#F4A261] to-[#E9C46A] text-white overflow-hidden">
        <RotatingLinesGrid />
        <div className="max-w-xs sm:max-w-2xl text-center mx-auto relative z-10">
          <h2 className="mb-4 text-4xl sm:text-5xl font-bold text-green-800">Experience the Power of</h2>
          <h1 className="mb-4 text-6xl sm:text-[10rem] font-extrabold text-green-800 tracking-widest">ØBEX</h1>
          <p className="mb-8 text-lg sm:text-xl text-green-600">Your Natural Barrier Against Heartburn</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="w-full sm:w-auto px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600" onClick={() => scrollToSection('cta-section')}>
              Buy Now
            </Button>
            <button className="w-full sm:w-auto px-6 py-2 border border-green-600 text-green-600 rounded hover:bg-green-100" onClick={() => scrollToSection('product_details')}>
              Learn More
            </button>
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
      <section id="research" className="bg-white py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#2A9D8F] mb-4">Medical Research Support</h2>
          
          <Card className="mb-8 border-yellow-300">
            <CardHeader className="bg-yellow-100">
              <HoverCard>
                <HoverCardTrigger>
                  <CardTitle className="mb-4 text-yellow-800">Comparative Study of Alginate and Omeprazole in Symptomatic Treatment of Non-erosive Gastroesophageal Reflux Disease</CardTitle>
                </HoverCardTrigger>
                <HoverCardContent className="bg-white text-black">
                  <a href="https://pubmed.ncbi.nlm.nih.gov/30487493/" target="_blank" className="text-left underline hover:text-blue-600">
                    Saifullah, A. M., Ahmed, F., Shil, B. C., Banik, R. K., Saha, S. K., Chowdhury, M., ... & Akhter, A. (2018). Comparative Study of Alginate and Omeprazole in Symptomatic Treatment of Non-erosive Gastroesophageal Reflux Disease. Mymensingh medical journal: MMJ, 27(4), 771-775.
                  </a>
                </HoverCardContent>
              </HoverCard>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-700">This study compared the effectiveness of sodium alginate and omeprazole in treating heartburn. The results showed that sodium alginate works just as well as omeprazole for treating heartburn, providing a new option for people who might want an alternative to traditional heartburn medications.</p>
              <p className="text-yellow-700"><strong>Bottom Line:</strong> If you suffer from heartburn, sodium alginate could be a great alternative to consider, especially if you're interested in a natural remedy.</p>
            </CardContent>
          </Card>
          
          <Card className="border-yellow-300">
            <CardHeader className="bg-yellow-100">
              <HoverCard>
                <HoverCardTrigger>
                  <CardTitle className="mb-4 text-yellow-800">Alginate on demand as add-on for patients with gastro-oesophageal reflux disease and insufficient PPI effect</CardTitle>
                </HoverCardTrigger>
                <HoverCardContent className="bg-white text-black">
                  <a href="https://pubmed.ncbi.nlm.nih.gov/30466131/" target="_blank" className="text-left underline hover:text-blue-600">
                    Müller, M., Labenz, G., Borkenstein, D. P., & Labenz, J. (2018). Alginate on demand as add-on for patients with gastro-oesophageal reflux disease and insufficient PPI effect. Deutsche Medizinische Wochenschrift (1946), 144(4), e30-e35.
                  </a>
                </HoverCardContent>
              </HoverCard>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-700">This study looked at adding alginate to the treatment plan of GERD patients who were already on PPIs but still had symptoms. After adding alginate, 72% of the patients felt better about their treatment, with many showing significant improvement.</p>
              <p className="text-yellow-700"><strong>What This Means:</strong> For people with chronic acid reflux who aren't satisfied with their current treatment, adding alginate can be an effective and safe way to manage symptoms.</p>
            </CardContent>
          </Card>
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
            <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => scrollToSection("product_details")}>
              Learn More
            </button>
            <button className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600" onClick={() => scrollToSection("cta-section")}>
              Buy Now
            </button>
          </div>
        </div>
      </section>

      {/* Flavour Options Section */}
      <section className="bg-[#E9EDe9] py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#2A9D8F] mb-4">Chef Developed Flavours</h2>
          <p className="mb-8 text-left text-gray-700">Discover the delicious side of relief with OBEX, now available in three chef-inspired flavours.</p>
          
          <div className="mb-8 p-4 bg-green-100 rounded-lg">
            <h3 className="text-2xl font-bold mb-2 text-green-700">Refreshing Mint</h3>
            <p className="text-gray-700">Experience the crisp and invigorating taste of refreshing mint. This classic flavour not only soothes your senses but also provides a cooling comforting sensation.</p>
          </div>
          
          <div className="mb-8 p-4 bg-yellow-100 rounded-lg">
            <h3 className="text-2xl font-bold mb-2 text-yellow-700">Lemon Meringue</h3>
            <p className="text-gray-700">Indulge in the delightful tang of lemon meringue, reminiscent of a classic dessert. The perfect balance of zesty lemon and sweet meringue creates a delectable treat that will brighten your day while keeping you comfortable.</p>
          </div>
          
          <div className="mb-8 p-4 bg-orange-100 rounded-lg">
            <h3 className="text-2xl font-bold mb-2 text-orange-700">Orange Cream</h3>
            <p className="text-gray-700">Savour the nostalgic blend of creamy vanilla and bright orange with our orange creamsicle flavour. This comforting and luscious option takes you back to childhood summers, offering a soothing and enjoyable way to manage reflux.</p>
          </div>
          
          <p className="text-left text-gray-700">Each flavour is crafted with care to provide an enjoyable taste experience. Say goodbye to the bland and medicinal, and hello to the delicious and natural with OBEX.</p>
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
                    Experience OBEX in three chef-inspired flavors:
                    <br />
                    <span className="font-medium">Orange Cream</span> • <span className="font-medium">Lemon Meringue</span> • <span className="font-medium">Refreshing Mint</span>
                  </p>
                  
                  {/* Purchase button */}
                  <a 
                    href="https://buy.stripe.com/bIY6rR8nbcePcAEcMQ?client_reference_id=obex_website&success_url=https://obexcanada.com/success?session_id={CHECKOUT_SESSION_ID}&cancel_url=https://obexcanada.com/cancel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute left-1/2 transform -translate-x-1/2 px-10 py-4 bg-[#2A9D8F] text-white text-lg font-semibold rounded-lg hover:bg-[#238276] transition-colors duration-200 text-center min-w-[200px] shadow-md"
                  >
                    Purchase Now
                  </a>
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