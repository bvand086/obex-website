"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

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
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-[#2A9D8F] mb-4">Thank You!</h1>
          <p className="text-xl text-gray-600 mb-8">Your order has been confirmed.</p>
          <div className="space-y-4">
            <p className="text-gray-500">
              We'll send you a confirmation email with your order details and tracking information once your order ships.
            </p>
            <p className="text-gray-500">
              If you have any questions about your order, please contact our support team at{' '}
              <a href="mailto:support@obexcanada.com" className="text-[#2A9D8F] hover:text-[#264653]">
                support@obexcanada.com
              </a>
            </p>
          </div>
          <div className="mt-8">
            <Link href="/">
              <Button className="w-full bg-[#2A9D8F] hover:bg-[#264653] text-white">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 