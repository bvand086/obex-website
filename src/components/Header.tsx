"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Instagram, Menu, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CartIcon from '@/components/CartIcon';

interface HeaderProps {
  onScrollToSection?: (id: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onScrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const scrollToSection = (id: string): void => {
    if (onScrollToSection) {
      onScrollToSection(id);
    } else {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/OSlashLogo.png" alt="ØBEX Logo" width={40} height={40} />
          <span className="text-xl font-bold text-[#2A9D8F]">ØBEX</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          {pathname === '/' ? (
            <button 
              onClick={() => scrollToSection("product_details")} 
              className="px-4 py-2 text-[#2A9D8F] hover:text-[#264653] hover:bg-[#2A9D8F]/5 rounded-lg transition-all duration-300"
            >
              About
            </button>
          ) : (
            <Link 
              href="/"
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/') 
                  ? 'text-[#264653] bg-[#2A9D8F]/10' 
                  : 'text-[#2A9D8F] hover:text-[#264653] hover:bg-[#2A9D8F]/5'
              }`}
            >
              Home
            </Link>
          )}
          
          <Link 
            href="/about"
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              isActive('/about') 
                ? 'text-[#264653] bg-[#2A9D8F]/10' 
                : 'text-[#2A9D8F] hover:text-[#264653] hover:bg-[#2A9D8F]/5'
            }`}
          >
            About Us
          </Link>
          
          <Link 
            href="/research"
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              isActive('/research') 
                ? 'text-[#264653] bg-[#2A9D8F]/10' 
                : 'text-[#2A9D8F] hover:text-[#264653] hover:bg-[#2A9D8F]/5'
            }`}
          >
            Research
          </Link>
          
          <Link 
            href="/blog"
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              pathname.startsWith('/blog') 
                ? 'text-[#264653] bg-[#2A9D8F]/10' 
                : 'text-[#2A9D8F] hover:text-[#264653] hover:bg-[#2A9D8F]/5'
            }`}
          >
            Blog
          </Link>
          
          <Dialog>
            <DialogTrigger asChild>
              <button className="px-4 py-2 text-[#2A9D8F] hover:text-[#264653] hover:bg-[#2A9D8F]/5 rounded-lg transition-all duration-300">
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
            className="px-4 py-2 text-[#2A9D8F] hover:text-[#264653] transition-all duration-300"
            aria-label="Follow us on Instagram"
          >
            <Instagram size={24} />
          </a>
          
          <div className="flex items-center space-x-4">
            <CartIcon />
            <Link 
              href="/cart" 
              className="px-6 py-2 bg-[#E9C46A] text-[#264653] font-medium rounded-lg hover:bg-[#e0bb5e] transition-all duration-300 shadow-md hover:shadow-lg"
            >
              View Cart
            </Link>
          </div>
        </div>

        <div className="md:hidden flex items-center space-x-4">
          <button 
            className="text-[#2A9D8F] hover:text-[#264653] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <CartIcon />
        </div>
      </nav>
      
      {/* Mobile menu */}
      <div className={`${
        isMenuOpen ? 'block' : 'hidden'
      } md:hidden bg-white/95 backdrop-blur-sm border-t`}>
        <div className="container mx-auto px-4 py-4 space-y-4">
          {pathname === '/' ? (
            <button 
              onClick={() => { scrollToSection("product_details"); setIsMenuOpen(false); }}
              className="block w-full text-left px-4 py-2 text-[#2A9D8F] hover:text-[#264653] hover:bg-[#2A9D8F]/5 rounded-lg transition-all duration-300"
            >
              About
            </button>
          ) : (
            <Link 
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className={`block w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive('/') 
                  ? 'text-[#264653] bg-[#2A9D8F]/10' 
                  : 'text-[#2A9D8F] hover:text-[#264653] hover:bg-[#2A9D8F]/5'
              }`}
            >
              Home
            </Link>
          )}
          
          <Link 
            href="/about"
            onClick={() => setIsMenuOpen(false)}
            className={`block w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
              isActive('/about') 
                ? 'text-[#264653] bg-[#2A9D8F]/10' 
                : 'text-[#2A9D8F] hover:text-[#264653] hover:bg-[#2A9D8F]/5'
            }`}
          >
            About Us
          </Link>
          
          <Link 
            href="/research"
            onClick={() => setIsMenuOpen(false)}
            className={`block w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
              isActive('/research') 
                ? 'text-[#264653] bg-[#2A9D8F]/10' 
                : 'text-[#2A9D8F] hover:text-[#264653] hover:bg-[#2A9D8F]/5'
            }`}
          >
            Research
          </Link>
          
          <Link 
            href="/blog"
            onClick={() => setIsMenuOpen(false)}
            className={`block w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
              pathname.startsWith('/blog') 
                ? 'text-[#264653] bg-[#2A9D8F]/10' 
                : 'text-[#2A9D8F] hover:text-[#264653] hover:bg-[#2A9D8F]/5'
            }`}
          >
            Blog
          </Link>
          
          <Dialog>
            <DialogTrigger asChild>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-left px-4 py-2 text-[#2A9D8F] hover:text-[#264653] hover:bg-[#2A9D8F]/5 rounded-lg transition-all duration-300"
              >
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
          
          <div className="flex items-center justify-between px-4 py-2">
            <a 
              href="https://www.instagram.com/obexcanada/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#2A9D8F] hover:text-[#264653] transition-all duration-300"
              aria-label="Follow us on Instagram"
              onClick={() => setIsMenuOpen(false)}
            >
              <Instagram size={24} />
            </a>
            <Link 
              href="/cart"
              onClick={() => setIsMenuOpen(false)}
              className="px-6 py-2 bg-[#E9C46A] text-[#264653] font-medium rounded-lg hover:bg-[#e0bb5e] transition-all duration-300 shadow-md hover:shadow-lg"
            >
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 