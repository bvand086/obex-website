"use client";

import CartDisplay from '@/components/CartDisplay';
import CartBackground from '@/components/cart/CartBackground';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F4F6F6]">
      <CartBackground />

      <div className="container mx-auto py-8 px-4 relative">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#2A9D8F]">Shopping Cart</h1>
          <Link href="/">
            <Button variant="ghost" className="text-[#2A9D8F] hover:text-[#264653]">
              Continue Shopping
            </Button>
          </Link>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg">
          <CartDisplay />
        </div>
      </div>
    </div>
  );
} 