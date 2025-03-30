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
    addToCart({
      priceId,
      flavor,
      name: "ØBEX Reflux Relief Bottle",
      quantity: 1,
      pricePerUnit: 34.99
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