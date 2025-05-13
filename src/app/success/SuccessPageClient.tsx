"use client";

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';

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
    return <div className="flex justify-center items-center min-h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-[#2A9D8F]" />
      <span className="ml-2">Loading order details...</span>
    </div>;
  }
  
  if (error) {
    return <div className="text-center py-12">
      <p className="text-red-500 mb-4">Failed to load order details.</p>
      <Button asChild variant="outline">
        <Link href="/">Return Home</Link>
      </Button>
    </div>;
  }
  
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
          
          {orderDetails && (
            <div className="space-y-6 text-left">
              <div className="border-b pb-4">
                <h2 className="text-lg font-semibold text-[#264653] mb-2">Order Summary</h2>
                <p className="text-sm text-gray-500">Order ID: {orderDetails.id}</p>
                <p className="text-sm text-gray-500">Total: ${(orderDetails.amount_total / 100).toFixed(2)} CAD</p>
                
                {orderDetails.shipping_cost && (
                  <p className="text-sm text-gray-500">
                    Shipping: ${(orderDetails.shipping_cost.amount_total / 100).toFixed(2)} CAD
                    {orderDetails.shipping_rate?.display_name && ` (${orderDetails.shipping_rate.display_name})`}
                  </p>
                )}
              </div>
              
              {orderDetails.shipping_details && (
                <div className="border-b pb-4">
                  <h2 className="text-lg font-semibold text-[#264653] mb-2">Shipping Details</h2>
                  <p className="text-sm text-gray-500">{orderDetails.shipping_details.name}</p>
                  <p className="text-sm text-gray-500">{orderDetails.shipping_details.address.line1}</p>
                  {orderDetails.shipping_details.address.line2 && (
                    <p className="text-sm text-gray-500">{orderDetails.shipping_details.address.line2}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    {orderDetails.shipping_details.address.city}, {orderDetails.shipping_details.address.state} {orderDetails.shipping_details.address.postal_code}
                  </p>
                  <p className="text-sm text-gray-500">{orderDetails.shipping_details.address.country}</p>
                </div>
              )}
              
              {orderDetails.items && orderDetails.items.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-[#264653] mb-2">Items</h2>
                  <ul className="space-y-2">
                    {orderDetails.items.map((item, index) => (
                      <li key={index} className="text-sm text-gray-500">
                        {item.quantity}x {item.description} - ${(item.amount_total / 100).toFixed(2)} CAD
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
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