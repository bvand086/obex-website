"use client";

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AddToCartButtonProps {
  priceId: string;
  flavor: string;
  className?: string;
}

export default function AddToCartButton({ priceId, flavor, className }: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // Validate priceId - don't add to cart if empty
    if (!priceId) {
      console.error(`Cannot add to cart: Invalid price ID for ${flavor}`);
      toast.error(`Sorry, this product is currently unavailable`);
      return;
    }
    
    // Get price from environment variable with fallback to 28.99 if not set
    const pricePerUnit = Number(process.env.NEXT_PUBLIC_BOTTLE_PRICE || 28.99);
    
    addToCart({
      priceId,
      flavor,
      name: "ØBEX Reflux Relief Bottle",
      quantity: 1,
      pricePerUnit
    });
    toast.success(`Added ${flavor} ØBEX to cart`);
  };

  return (
    <Button
      onClick={handleAddToCart}
      className={className}
    >
      Add to Cart
    </Button>
  );
} 