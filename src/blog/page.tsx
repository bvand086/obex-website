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
      <header className="bg-[#2A9D8F] text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/OSlashLogo.png" alt="OBEX Logo" width={40} height={40} className="rounded-full" />
              <h1 className="text-2xl font-bold">OBEX</h1>
            </Link>
            <nav>
              <Link href="/" className="text-white hover:text-green-200 transition-colors">
                Home
              </Link>
            </nav>
          </div>
        </div>
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
          <p className="text-xs text-gray-400 max-w-xl mx-auto mt-4">
            These statements have not been evaluated by Health Canada. This product is not intended to diagnose, treat, cure, or prevent any disease. Consult a healthcare practitioner prior to use if you have a medical condition or are taking medications.
          </p>
          <Link href="/" className="text-green-300 hover:text-green-100 transition-colors">
            Back to Home
          </Link>
          
        </div>
      </footer>
    </main>
  );
}