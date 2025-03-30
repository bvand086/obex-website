"use client";

import CartDisplay from '@/components/CartDisplay';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F4F6F6]">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#2A9D8F]/5 rounded-full blur-3xl transform -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#E9C46A]/5 rounded-full blur-3xl transform translate-y-1/4 -translate-x-1/4"></div>
      </div>

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