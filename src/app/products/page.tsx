import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FLAVOR_DATA } from '@/lib/flavorData';
import FlavorCard from '@/components/FlavorCard';
import { Button } from '@/components/ui/button';

export default function Products() {
  return (
    <main className="min-h-screen relative bg-gradient-to-br from-[#FAFAF9] to-[#F4F6F6]">
      {/* Background decorative elements */}
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

      {/* Main Content */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A9D8F]/10 to-[#E9C46A]/10 rounded-2xl transform transition-transform duration-500"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-12 rounded-2xl shadow-xl border border-[#2A9D8F]/10 overflow-hidden">
            {/* Background Product Image */}
            <div className="absolute inset-0 opacity-95 flex flex-col">
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

        {/* Flavour Cards Section */}
        <div className="relative mb-16">
          {/* Background Product Photography Gallery */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Product Photo 1 - Left background */}
            <div className="absolute -left-16 top-1/6 w-[28rem] h-[32rem] transform -rotate-12">
              <div className="w-full h-full rounded-3xl shadow-2xl opacity-45 overflow-hidden bg-gradient-to-br from-[#2A9D8F] to-[#2A9D8F]/80">
                {/* Placeholder content */}
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-white/60">
                    <div className="w-24 h-48 bg-white/20 rounded-full mx-auto mb-4"></div>
                    <p className="text-lg font-medium">Product Photo 1</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Photo 2 - Center background (Lemon) */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-24 w-[32rem] h-[36rem] rotate-3">
              <div className="relative w-full h-full rounded-3xl shadow-2xl opacity-50 overflow-hidden">
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

            {/* Product Photo 3 - Right background */}
            <div className="absolute -right-16 top-1/4 w-[28rem] h-[32rem] transform rotate-8">
              <div className="w-full h-full rounded-3xl shadow-2xl opacity-45 overflow-hidden bg-gradient-to-br from-[#264653] to-[#264653]/80">
                {/* Placeholder content */}
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-white/60">
                    <div className="w-24 h-48 bg-white/20 rounded-full mx-auto mb-4"></div>
                    <p className="text-lg font-medium">Product Photo 3</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto text-center mb-12 relative z-10">
            <span className="inline-block px-4 py-1 bg-[#E9C46A]/10 text-[#E9C46A] rounded-full text-sm font-medium mb-4">Available Flavours</span>
            <h2 className="text-4xl font-bold text-[#2A9D8F] mb-4">Chef Developed Flavours</h2>
            <p className="text-gray-600 text-lg">
              Choose from three expertly crafted flavours, each designed to provide natural heartburn relief with an exceptional taste experience.
            </p>
          </div>
          
          {/* Flavour Cards Grid */}
          <div className="grid gap-8 md:grid-cols-3 mb-12 relative z-10">
            {FLAVOR_DATA.map((flavor) => (
              <FlavorCard key={flavor.id} flavor={flavor} />
            ))}
          </div>
        </div>

        {/* Product Information Section */}
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-gradient-to-br from-[#E9C46A]/5 to-[#2A9D8F]/5 rounded-2xl transform transition-transform duration-500"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-12 rounded-2xl shadow-xl border border-[#E9C46A]/10">
            <h2 className="text-3xl font-bold text-[#264653] mb-6">About OBEX</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-[#2A9D8F] mb-4">Natural Relief</h3>
                <p className="text-gray-600 mb-6">
                  OBEX uses sodium alginate, a natural substance derived from seaweed, to create a protective barrier 
                  that prevents acid reflux. This natural approach provides effective relief without harsh chemicals.
                </p>
                
                <h3 className="text-xl font-semibold text-[#2A9D8F] mb-4">Chef-Crafted Flavours</h3>
                <p className="text-gray-600">
                  Our flavours are developed by professional chefs to ensure an enjoyable taste experience. 
                  Say goodbye to chalky, medicinal-tasting antacids and hello to delicious relief.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-[#2A9D8F] mb-4">Made in Canada</h3>
                <p className="text-gray-600 mb-6">
                  Proudly developed and manufactured in Hamilton, Ontario, OBEX represents Canadian innovation 
                  in natural health products, backed by scientific research and culinary expertise.
                </p>
                
                <h3 className="text-xl font-semibold text-[#2A9D8F] mb-4">Fast-Acting</h3>
                <p className="text-gray-600">
                  OBEX works quickly to form a protective gel raft on top of stomach contents, 
                  providing rapid relief from heartburn and acid reflux symptoms.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bundle Options Section */}
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A9D8F]/5 to-[#264653]/5 rounded-2xl transform transition-transform duration-500"></div>
          
          {/* Bundle background product elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-8 -left-8 w-40 h-56 transform -rotate-12 opacity-5">
              <div className="w-full h-full bg-gradient-to-br from-[#E9C46A] to-[#E9C46A]/60 rounded-2xl">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-24 bg-white/30 rounded-full"></div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 w-36 h-48 transform rotate-6 opacity-5">
              <div className="w-full h-full bg-gradient-to-br from-[#2A9D8F] to-[#2A9D8F]/60 rounded-2xl">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-9 h-20 bg-white/30 rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="relative bg-white/90 backdrop-blur-sm p-12 rounded-2xl shadow-xl border border-[#2A9D8F]/10">
            <div className="text-center mb-8">
              <span className="inline-block px-4 py-1 bg-[#264653]/10 text-[#264653] rounded-full text-sm font-medium mb-4">Bundle Options</span>
              <h2 className="text-3xl font-bold text-[#264653] mb-4">Choose Your Package</h2>
              <p className="text-gray-600 text-lg">
                Select the perfect OBEX bundle that fits your needs and enjoy greater savings with larger packages.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Starter Bundle */}
              <div className="bg-gradient-to-br from-[#E9C46A]/10 to-white p-6 rounded-xl border border-[#E9C46A]/20 flex flex-col h-full">
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-[#264653] mb-2">Starter</h3>
                  <p className="text-2xl font-bold text-[#2A9D8F] mb-1">$28.99</p>
                  <div className="h-6 mb-4"></div> {/* Spacer for alignment */}
                  <ul className="text-sm text-gray-600 space-y-2 mb-6">
                    <li>• 1 bottle of OBEX</li>
                    <li>• Choose your flavour</li>
                    <li>• Perfect for trying OBEX</li>
                  </ul>
                </div>
                <Button className="w-full bg-[#E9C46A] text-[#264653] hover:bg-[#e0bb5e] mt-auto">
                  Select Starter
                </Button>
              </div>
              
              {/* Value Bundle */}
              <div className="bg-gradient-to-br from-[#2A9D8F]/10 to-white p-6 rounded-xl border border-[#2A9D8F]/20 relative flex flex-col h-full">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-[#2A9D8F] text-white px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-[#264653] mb-2">Value</h3>
                  <p className="text-2xl font-bold text-[#2A9D8F] mb-1">$74.99</p>
                  <p className="text-sm text-gray-500 line-through mb-4">$86.97</p>
                  <ul className="text-sm text-gray-600 space-y-2 mb-6">
                    <li>• 3 bottles of OBEX</li>
                    <li>• Mix and match flavours</li>
                    <li>• 14% savings</li>
                  </ul>
                </div>
                <Button className="w-full bg-[#2A9D8F] text-white hover:bg-[#238276] mt-auto">
                  Select Value
                </Button>
              </div>
              
              {/* Premium Bundle */}
              <div className="bg-gradient-to-br from-[#264653]/10 to-white p-6 rounded-xl border border-[#264653]/20 flex flex-col h-full">
                <div className="flex-grow">
                  <h3 className="text-xl font-bold text-[#264653] mb-2">Premium</h3>
                  <p className="text-2xl font-bold text-[#2A9D8F] mb-1">$139.99</p>
                  <p className="text-sm text-gray-500 line-through mb-4">$173.94</p>
                  <ul className="text-sm text-gray-600 space-y-2 mb-6">
                    <li>• 6 bottles of OBEX</li>
                    <li>• All three flavours included</li>
                    <li>• 20% savings + free shipping</li>
                  </ul>
                </div>
                <Button className="w-full bg-[#264653] text-white hover:bg-[#1e3a3a] mt-auto">
                  Select Premium
                </Button>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link 
                href="/#cta-section" 
                className="inline-flex items-center text-[#2A9D8F] hover:text-[#264653] transition-colors duration-300"
              >
                <span className="font-medium">View detailed pricing →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-[#264653] text-white py-12">
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
    </main>
  );
} 