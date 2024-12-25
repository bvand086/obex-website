import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts, BlogPost } from '@/lib/blogData';

const BlogPostCard = ({ title, excerpt, date, slug }: BlogPost) => (
  <div className="group relative mb-8 p-8 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100">
    <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
    <div className="relative z-10">
      <p className="text-sm text-green-600 mb-2 font-medium tracking-wider uppercase">{date}</p>
      <h2 className="text-2xl font-bold mb-3 text-green-800 group-hover:text-green-700 transition-colors">{title}</h2>
      <p className="text-gray-600 mb-4 leading-relaxed">{excerpt}</p>
      <Link 
        href={`/blog/${slug}`} 
        className="inline-flex items-center text-green-600 hover:text-green-800 font-semibold group-hover:translate-x-2 transition-transform duration-300"
      >
        Read more
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  </div>
);

export default async function Blog() {
  const blogPosts = await getBlogPosts();

  return (
    <main className="min-h-screen relative bg-gradient-to-br from-[#E9C46A] via-[#F4A261] to-[#2A9D8F] font-raleway">
      <div className="absolute inset-0 bg-white/80" />
      
      <header className="sticky top-0 z-20 border-b border-green-200/50 backdrop-blur-sm bg-white/70">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between p-4">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-black shadow-lg">
                <Image src="/white_transparent_OSlashLogo.png" alt="OBEX Logo" width={32} height={32} className="object-cover" />
              </div>
              <h1 className="text-2xl font-bold text-green-800">OBEX</h1>
            </div>
            <nav className="flex gap-4 items-center">
              <Link href="/" className="px-4 py-2 text-green-700 hover:text-green-900 hover:bg-green-100/80 rounded-lg transition-all duration-300">
                Home
              </Link>
              <Link href="/#product_details" className="px-4 py-2 text-green-700 hover:text-green-900 hover:bg-green-100/80 rounded-lg transition-all duration-300">
                About
              </Link>
              <Link href="/#research" className="px-4 py-2 text-green-700 hover:text-green-900 hover:bg-green-100/80 rounded-lg transition-all duration-300">
                Research
              </Link>
              <Link href="/#cta-section" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-300">
                Main
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <section className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        <div className="mb-12 p-12 bg-white/90 backdrop-blur-sm rounded-xl shadow-xl">
          <h1 className="text-5xl font-bold mb-6 text-green-800 leading-tight">
            OBEX Blog
          </h1>
          <p className="text-xl text-gray-700 leading-relaxed max-w-2xl">
            Stay informed about the latest in natural heartburn relief and digestive health. 
            Discover expert insights, research updates, and practical tips for managing reflux naturally.
          </p>
        </div>
        
        <div className="grid gap-8">
          {blogPosts.map((post: BlogPost) => (
            <BlogPostCard key={post.id} {...post} />
          ))}
        </div>
      </section>

      <footer className="relative z-10 bg-[#264653] text-white py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="mb-2">© 2024 OBEX Corporation. All rights reserved.</p>
          <p className="text-sm text-green-300 mb-4">
            Contact us: <a href="mailto:support@obexcanada.com" className="hover:text-green-100 transition-colors">support@obexcanada.com</a>
          </p>
          <Link 
            href="/" 
            className="text-green-300 hover:text-green-100 transition-colors inline-flex items-center gap-2"
          >
            <span>Back to Home</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </Link>
        </div>
      </footer>
    </main>
  );
}