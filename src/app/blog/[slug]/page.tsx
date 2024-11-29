import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPostData } from '@/lib/blogData';

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const postData = await getPostData(params.slug);

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
              <Link href="/blog" className="px-4 py-2 text-green-700 hover:text-green-900 hover:bg-green-100/80 rounded-lg transition-all duration-300">
                Blog
              </Link>
              <Link href="/#cta-section" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-300">
                Order
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <article className="relative z-10 max-w-5xl mx-auto px-4 py-12">
        <div className="p-12 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-green-600 hover:text-green-800 mb-8 group"
          >
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
          
          <div className="mb-8 pb-8 border-b border-green-100">
            <h1 className="text-5xl font-bold mb-4 text-green-800 leading-tight">{postData.title}</h1>
            <p className="text-green-600 text-lg">{postData.date}</p>
          </div>
          
          <div 
            className="prose prose-lg max-w-none prose-headings:text-green-800 prose-a:text-green-600 hover:prose-a:text-green-800 prose-strong:text-green-700 prose-blockquote:border-green-300 prose-pre:bg-gray-50 prose-pre:shadow-sm prose-img:rounded-xl prose-img:shadow-lg"
            dangerouslySetInnerHTML={{ __html: postData.contentHtml }} 
          />
        </div>
      </article>

      <footer className="relative z-10 bg-[#264653] text-white py-12">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="mb-4">© 2024 OBEX Corporation. All rights reserved.</p>
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
