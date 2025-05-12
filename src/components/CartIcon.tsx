"use client";

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CartIcon() {
  const { totalBottles } = useCart();
  
  return (
    <Link href="/cart">
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-6 w-6" />
        {totalBottles > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalBottles}
          </span>
        )}
      </Button>
    </Link>
  );
} 