import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts, BlogPost } from '@/lib/blogData';

const BlogPostCard = ({ title, excerpt, date, slug }: BlogPost) => (
  <div className="group relative">
    {/* Background gradient and blur effects */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#2A9D8F]/20 to-[#E9C46A]/20 rounded-2xl transform transition-transform duration-500 group-hover:scale-[0.98]"></div>
    <div className="absolute -inset-0.5 bg-gradient-to-br from-[#2A9D8F] to-[#E9C46A] opacity-20 rounded-2xl blur group-hover:opacity-30 transition duration-500"></div>
    
    {/* Card content */}
    <div className="relative bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl transition-all duration-500 group-hover:shadow-2xl border border-[#2A9D8F]/10">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2A9D8F] to-[#E9C46A] flex items-center justify-center transform transition-transform duration-500 group-hover:rotate-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
          </svg>
        </div>
        <div>
          <p className="text-sm text-[#2A9D8F] font-medium tracking-wider uppercase">{date}</p>
          <h2 className="text-2xl font-bold text-[#264653] group-hover:text-[#2A9D8F] transition-colors duration-300">{title}</h2>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-gray-600 leading-relaxed">{excerpt}</p>
        
        <Link 
          href={`/blog/${slug}`} 
          className="inline-flex items-center text-[#2A9D8F] hover:text-[#264653] transition-colors duration-300 group/link"
        >
          <span className="font-medium">Read Article</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform transition-transform duration-300 group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  </div>
);

export default async function Blog() {
  const blogPosts = await getBlogPosts();

  return (
    <main className="min-h-screen relative bg-gradient-to-br from-[#FAFAF9] to-[#F4F6F6]">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#2A9D8F]/5 rounded-full blur-3xl transform -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#E9C46A]/5 rounded-full blur-3xl transform translate-y-1/4 -translate-x-1/4"></div>
      </div>
      

      {/* Main Content */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2A9D8F]/10 to-[#E9C46A]/10 rounded-2xl transform transition-transform duration-500"></div>
          <div className="relative bg-white/90 backdrop-blur-sm p-12 rounded-2xl shadow-xl border border-[#2A9D8F]/10">
            <span className="inline-block px-4 py-1 bg-[#2A9D8F]/10 text-[#2A9D8F] rounded-full text-sm font-medium mb-4">Latest Updates</span>
            <h1 className="text-5xl font-bold mb-6 text-[#264653] leading-tight">
              OBEX Blog
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
              Stay informed about the latest in natural heartburn relief and digestive health. 
              Discover expert insights, research updates, and practical tips for managing reflux naturally.
            </p>
          </div>
        </div>
        
        {/* Blog Posts Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {blogPosts.map((post: BlogPost) => (
            <BlogPostCard key={post.id} {...post} />
          ))}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
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