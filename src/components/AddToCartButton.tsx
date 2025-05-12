"use client";

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AddToCartButtonProps {
  priceId: string;
  flavor: string;
  className?: string;
  quantity?: number;
  bundleType?: 'starter' | 'value' | 'premium';
}

export default function AddToCartButton({ 
  priceId, 
  flavor, 
  className,
  quantity = 1,
  bundleType
}: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // Validate priceId - don't add to cart if empty
    if (!priceId) {
      console.error(`Cannot add to cart: Invalid price ID for ${flavor}`);
      toast.error(`Sorry, this product is currently unavailable`);
      return;
    }

    // ALWAYS use fixed values for bundles, completely ignoring quantity prop
    let bottlesToAdd: number;
    
    if (bundleType === 'starter') {
      bottlesToAdd = 1;
    } else if (bundleType === 'value') {
      bottlesToAdd = 3;
    } else if (bundleType === 'premium') {
      bottlesToAdd = 6;
    } else {
      // Only use quantity prop if no bundleType specified
      bottlesToAdd = quantity;
    }
    
    console.log(`Adding ${bottlesToAdd} bottles for bundle type: ${bundleType}`);
    
    // Add bottles to cart
    addToCart({
      priceId,
      flavor,
      name: "ØBEX Reflux Relief",
      quantity: bottlesToAdd,
      pricePerUnit: Number(process.env.NEXT_PUBLIC_BOTTLE_PRICE || 28.99)
    });
    
    toast.success(`Added ${bottlesToAdd} bottle${bottlesToAdd > 1 ? 's' : ''} to cart`);
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