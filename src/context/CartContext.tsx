"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FLAVORS, FlavorCounts } from '@/components/FlavorSelector';

export interface CartItem {
  id: string;
  priceId: string;
  flavor: string;
  quantity: number;
  name: string;
  pricePerUnit: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateFlavors: (itemId: string, flavors: FlavorCounts) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  itemCount: number;
  totalBottles: number;
  freeShippingUnlocked: boolean;
  bottlesUntilFreeShipping: number;
  currentTier: 'starter' | 'value' | 'premium';
  getDiscountPercent: () => number;
  getUnitPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to get initial state from localStorage
const getInitialCart = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    const storedCart = localStorage.getItem('obexCart');
    return storedCart ? JSON.parse(storedCart) : [];
  }
  return [];
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(getInitialCart);
  const [itemCount, setItemCount] = useState<number>(0);
  const [totalBottles, setTotalBottles] = useState<number>(0);
  const [freeShippingUnlocked, setFreeShippingUnlocked] = useState<boolean>(false);
  const [bottlesUntilFreeShipping, setBottlesUntilFreeShipping] = useState<number>(6);
  const [currentTier, setCurrentTier] = useState<'starter' | 'value' | 'premium'>('starter');

  // Calculate total bottles and determine tier
  useEffect(() => {
    console.log('[Effect] Cart items changed:', cartItems); // Log start of effect

    // Calculate total bottles in the cart
    const bottles = cartItems.reduce((total, item) => total + item.quantity, 0);
    console.log('[Effect] Calculated total bottles:', bottles); // Log calculated bottles
    setTotalBottles(bottles);
    
    // Determine tier based on total bottles
    if (bottles >= 6) {
      setCurrentTier('premium');
      setFreeShippingUnlocked(true);
      setBottlesUntilFreeShipping(0);
    } else if (bottles >= 3) {
      setCurrentTier('value');
      setFreeShippingUnlocked(false);
      setBottlesUntilFreeShipping(6 - bottles);
    } else {
      setCurrentTier('starter');
      setFreeShippingUnlocked(false);
      setBottlesUntilFreeShipping(6 - bottles);
    }
    
    // Calculate item count (number of unique products)
    setItemCount(cartItems.length);
    
    // Apply appropriate pricing based on tier
    updatePricing(); // This calls setCartItems again, potentially causing loop? Let's log after it too.
    console.log('[Effect] Finished updating pricing.'); // Log end of effect
  }, [cartItems]); // Dependency on cartItems

  // Get current discount percentage based on tier
  const getDiscountPercent = (): number => {
    if (totalBottles >= 6) return 20; // 20% for Premium tier
    if (totalBottles >= 3) return 14; // 14% for Value tier
    return 0; // No discount for Starter tier
  };

  // Get base unit price (before discount)
  const getBasePrice = (): number => {
    return Number(process.env.NEXT_PUBLIC_BOTTLE_PRICE || 28.99);
  };

  // Get unit price after discount
  const getUnitPrice = (): number => {
    const discount = getDiscountPercent();
    const basePrice = getBasePrice();
    if (discount === 0) return basePrice;
    return Math.round((basePrice * (1 - discount / 100)) * 100) / 100;
  };

  // Update prices based on current tier
  const updatePricing = () => {
    const unitPrice = getUnitPrice();
    console.log('[updatePricing] Calculated unit price:', unitPrice); // Add log

    setCartItems(currentItems => {
      console.log('[updatePricing] Current items before update:', currentItems); // Add log
      let changed = false;
      const updatedItems = currentItems.map(item => {
        if (item.pricePerUnit !== unitPrice) {
          changed = true;
          return { ...item, pricePerUnit: unitPrice };
        }
        return item;
      });
      console.log('[updatePricing] Items after potential update:', updatedItems);

      // Only update state if any item's price actually changed
      if (!changed) {
         console.log('[updatePricing] No actual price change in items, skipping setCartItems.');
         return currentItems; // Return original items (same reference)
      }

      console.log('[updatePricing] Prices changed, calling setCartItems.');
      return updatedItems; // Return the new array with updated prices
    });
  };

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('obexCart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (itemToAdd: Omit<CartItem, 'id'>) => {
    console.log('[addToCart] Called with item:', itemToAdd);
    
    setCartItems(prevItems => {
      console.log('[addToCart Update] Running with prevItems:', prevItems);
      console.log('[addToCart Update] Item to add quantity:', itemToAdd.quantity);

      // Check if the consolidated item already exists
      const existingItem = prevItems.find(item => item.name === "ØBEX Reflux Relief"); // Or use a more robust ID check if needed

      if (existingItem) {
        // Calculate the new quantity idempotently
        const newQuantity = existingItem.quantity + itemToAdd.quantity;
        console.log(`[addToCart Update] Existing quantity: ${existingItem.quantity}, New calculated quantity: ${newQuantity}`);

        // Return a new array with the updated item
        const updatedItems = [
          {
            ...existingItem,
            quantity: newQuantity,
            priceId: itemToAdd.priceId, // Ensure priceId is updated if needed (e.g., from different bundle buttons)
            pricePerUnit: itemToAdd.pricePerUnit // Carry over initial price, useEffect will adjust
          }
        ];
        toast.success(`Added ${itemToAdd.quantity} bottle(s). Total: ${newQuantity}`);
        console.log('[addToCart Update] Returning updated item:', updatedItems);
        return updatedItems;

      } else {
        // Add the first item to the cart
        const newItem: CartItem = {
          ...itemToAdd,
          id: `obex-bottle-${Date.now()}`, // Use a consistent ID prefix
          name: "ØBEX Reflux Relief",      // Ensure consistent name
          // quantity is already set correctly in itemToAdd
        };
        toast.success(`Added ${itemToAdd.quantity} bottle(s) to cart`);
        console.log('[addToCart Update] Adding new item:', newItem);
        return [newItem];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === itemId);
      if (itemToRemove) {
        toast.success(`Removed ${itemToRemove.flavor} from cart`);
      }
      return prevItems.filter(item => item.id !== itemId);
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, quantity: quantity } : item
        )
      );
    }
  };

  const updateFlavors = (itemId: string, flavors: FlavorCounts) => {
    // For our simplified approach, we're not dealing with flavor counts directly
    // This would be a place to update the flavor of an item if needed
    setCartItems(prevItems => prevItems.map(item => {
      if (item.id === itemId) {
        // Convert flavors to a single flavor string
        const flavorString = Object.entries(flavors)
          .filter(([_, count]) => count > 0)
          .map(([flavorId, count]) => {
            const flavorName = FLAVORS.find(f => f.id === flavorId)?.name || flavorId;
            return `${flavorName} (${count})`;
          })
          .join(', ');
        
        return { ...item, flavor: flavorString };
      }
      return item;
    }));
    
    toast.success('Updated flavor selection');
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared');
  };

  const getCartTotal = (): number => {
    return cartItems.reduce((total, item) => total + item.pricePerUnit * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateFlavors,
        clearCart,
        getCartTotal,
        itemCount,
        totalBottles,
        freeShippingUnlocked,
        bottlesUntilFreeShipping,
        currentTier,
        getDiscountPercent,
        getUnitPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 