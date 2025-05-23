"use client";

import React from 'react';
import Link from 'next/link';

const ResearchContent: React.FC = () => {
  const scrollToSection = (id: string): void => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="bg-[#FAFAF9] text-[#264653] pt-20">
      {/* Research Section */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-b from-white to-[#F4F6F6]">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#2A9D8F]/5 rounded-full blur-3xl transform -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#E9C46A]/5 rounded-full blur-3xl transform translate-y-1/4 -translate-x-1/4"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-[#2A9D8F]/10 text-[#2A9D8F] rounded-full text-sm font-medium mb-4">Evidence-Based</span>
            <h1 className="text-5xl font-bold text-[#2A9D8F] mb-4">Medical Research Support</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Discover the scientific evidence behind OBEX's effectiveness in managing reflux symptoms.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
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

          {/* How Sodium Alginate Works Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-[#2A9D8F] mb-6 text-center">How Sodium Alginate Works</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#2A9D8F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#2A9D8F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-[#264653] mb-2">1. Ingestion</h3>
                  <p className="text-gray-600 text-sm">Sodium alginate is consumed and reaches the stomach</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#E9C46A]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#E9C46A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-[#264653] mb-2">2. Reaction</h3>
                  <p className="text-gray-600 text-sm">Reacts with stomach acid to form a protective gel-like raft</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#F4A261]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#F4A261]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-[#264653] mb-2">3. Protection</h3>
                  <p className="text-gray-600 text-sm">Creates a barrier preventing acid reflux into the esophagus</p>
                </div>
              </div>
              
              <div className="bg-[#2A9D8F]/5 p-6 rounded-lg">
                <h4 className="font-semibold text-[#2A9D8F] mb-3">Why This Mechanism is Effective:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-[#2A9D8F] mr-3 mt-2"></span>
                    <span className="text-gray-700">Provides rapid, physical barrier protection</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-[#2A9D8F] mr-3 mt-2"></span>
                    <span className="text-gray-700">Works independently of acid production</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-[#2A9D8F] mr-3 mt-2"></span>
                    <span className="text-gray-700">Natural, well-tolerated mechanism</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 rounded-full bg-[#2A9D8F] mr-3 mt-2"></span>
                    <span className="text-gray-700">Can complement other treatments</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <p className="text-gray-600 text-lg mb-8">Our commitment to evidence-based solutions drives continuous research and development.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="/#cta-section"
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-[#2A9D8F] to-[#264653] text-white rounded-lg hover:from-[#264653] hover:to-[#2A9D8F] transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Try OBEX Today
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
              <Link 
                href="/about"
                className="inline-flex items-center px-8 py-3 border-2 border-[#2A9D8F] text-[#2A9D8F] rounded-lg hover:bg-[#2A9D8F]/10 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Learn Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ResearchContent; 