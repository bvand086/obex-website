"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAFAF9] to-[#F4F6F6]">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[#2A9D8F]/5 rounded-full blur-3xl transform -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#E9C46A]/5 rounded-full blur-3xl transform translate-y-1/4 -translate-x-1/4"></div>
      </div>

      <div className="max-w-md w-full space-y-8 p-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg relative">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Cancelled</h1>
          <p className="text-xl text-gray-600 mb-8">Your checkout process was cancelled.</p>
          <div className="space-y-4">
            <p className="text-gray-500">
              Your cart has been preserved. You can return to checkout whenever you're ready.
            </p>
          </div>
          <div className="mt-8 space-y-4">
            <Link href="/">
              <Button variant="outline" className="w-full">
                Return to Home
              </Button>
            </Link>
            <Link href="/cart">
              <Button className="w-full bg-[#2A9D8F] hover:bg-[#264653] text-white">
                Return to Cart
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 