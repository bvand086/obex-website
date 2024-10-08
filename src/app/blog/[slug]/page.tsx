import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getPostData } from '@/lib/blogData';

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const postData = await getPostData(params.slug);

  return (
    <main className="bg-[#FAFAF9] text-[#264653] min-h-screen">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-green-200 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center bg-black">
            <Image src="/OSlashLogo.png" alt="OBEX Head" width={28} height={28} className="object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-green-800">OBEX</h1>
        </div>
        <nav className="flex gap-4 items-center">
          <Link href="/" className="px-4 py-2 text-green-700 hover:text-green-900 hover:bg-green-100 rounded transition-colors">
            Home
          </Link>
          <Link href="/blog" className="px-4 py-2 text-green-700 hover:text-green-900 hover:bg-green-100 rounded transition-colors">
            Blog
          </Link>
          <Link href="/#cta-section" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
            Order
          </Link>
        </nav>
      </header>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-4 text-green-800">{postData.title}</h1>
        <p className="text-gray-600 mb-8">{postData.date}</p>
        <div 
          className="prose lg:prose-xl max-w-none"
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }} 
        />
      </article>

      {/* Footer */}
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
