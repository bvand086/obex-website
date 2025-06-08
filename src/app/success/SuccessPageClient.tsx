"use client";

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import SuccessBackground from '@/components/success/SuccessBackground';
import OrderSummaryCard from '@/components/success/OrderSummaryCard';
import LoadingState from '@/components/success/LoadingState';
import ErrorState from '@/components/success/ErrorState';

interface OrderDetails {
  id: string;
  amount_total: number;
  shipping_details?: {
    name: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
  shipping_cost?: {
    amount_total: number;
    shipping_rate: string;
  };
  shipping_rate?: {
    display_name: string;
  };
  items?: {
    description: string;
    quantity: number;
    amount_total: number;
  }[];
}

export default function SuccessPageClient() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const fetchAttempted = useRef(false);
  
  useEffect(() => {
    clearCart();
    
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId || fetchAttempted.current) return;
    
    const fetchOrderDetails = async () => {
      fetchAttempted.current = true;
      
      try {
        const response = await fetch(`/api/checkout-sessions/${sessionId}`);
        if (!response.ok) throw new Error('Failed to fetch order details');
        
        const data = await response.json();
        setOrderDetails(data);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [searchParams, clearCart]);

  if (loading) {
    return <LoadingState />;
  }
  
  if (error) {
    return <ErrorState />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAFAF9] to-[#F4F6F6]">
      <SuccessBackground />

      <div className="max-w-md w-full space-y-8 p-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg relative">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-[#2A9D8F] mb-4">Thank You!</h1>
          <p className="text-xl text-gray-600 mb-8">Your order has been confirmed.</p>
          
          {orderDetails && <OrderSummaryCard orderDetails={orderDetails} />}
          
          <div className="space-y-4 mt-8">
            <p className="text-gray-500">
              We'll send you a confirmation email with your order details. Thanks for your purchase!
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