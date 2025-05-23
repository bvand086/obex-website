"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const AboutContent: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

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

  if (!isMounted) {
    return null;
  }

  return (
    <main className="bg-[#FAFAF9] text-[#264653] pt-20">
      {/* Add timeline styles */}
      <style jsx global>{timelineStyles}</style>
      
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
            <h1 className="text-5xl font-bold text-center text-[#2A9D8F] mb-4 relative">
              Our Story
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-[#F4A261]"></div>
            </h1>
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

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-[#2A9D8F] mb-4">Ready to Experience OBEX?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover the difference that our chef-crafted, science-backed sodium alginate blend can make for your comfort and well-being.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="/#cta-section"
                className="px-8 py-3 bg-[#2A9D8F] text-white rounded-lg hover:bg-[#238276] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Shop Now
              </a>
              <a 
                href="/research"
                className="px-8 py-3 border-2 border-[#2A9D8F] text-[#2A9D8F] rounded-lg hover:bg-[#2A9D8F]/10 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                View Research
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutContent; 