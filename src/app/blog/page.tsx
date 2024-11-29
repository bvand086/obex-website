import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBlogPosts, BlogPost } from '@/lib/blogData';

const BlogPostCard = ({ title, excerpt, date, slug }: BlogPost) => (
  <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-2 text-green-800">{title}</h2>
    <p className="text-gray-600 mb-4">{date}</p>
    <p className="text-gray-700 mb-4">{excerpt}</p>
    <Link href={`/blog/${slug}`} className="text-green-600 hover:text-green-800 font-semibold">
      Read more
    </Link>
  </div>
);

export default async function Blog() {
  const blogPosts = await getBlogPosts();

  return (
    <main className="bg-[#FAFAF9] text-[#264653] min-h-screen">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-green-200 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-black">
            <Image src="/white_transparent_OSlashLogo.png" alt="OBEX Logo" width={28} height={28} className="object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-green-800">OBEX</h1>
        </div>
        <nav className="flex gap-4 items-center">
          <Link href="/" className="px-4 py-2 text-green-700 hover:text-green-900 hover:bg-green-100 rounded transition-colors">
            Home
          </Link>
          <Link href="/#product_details" className="px-4 py-2 text-green-700 hover:text-green-900 hover:bg-green-100 rounded transition-colors">
            About
          </Link>
          <Link href="/#research" className="px-4 py-2 text-green-700 hover:text-green-900 hover:bg-green-100 rounded transition-colors">
            Research
          </Link>
          <Link href="/#cta-section" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
            Contact
          </Link>
        </nav>
      </header>

      <section className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-green-800">OBEX Blog</h1>
        <p className="text-xl mb-8 text-gray-700">Stay informed about the latest in natural heartburn relief and digestive health.</p>
        
        {blogPosts.map((post: BlogPost) => (
          <BlogPostCard key={post.id} {...post} />
        ))}
      </section>

      <footer className="bg-[#264653] text-white py-8">
        <div className="max-w-4xl mx-auto text-center">
          <p>© 2024 OBEX Corporation. All rights reserved.</p>
          <Link href="/" className="text-green-300 hover:text-green-100 transition-colors">
            Back to Home
          </Link>
        </div>
      </footer>
    </main>
  );
}