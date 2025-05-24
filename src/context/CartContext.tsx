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
  flavor_breakdown: string; // Human-readable breakdown of flavours
  flavor_counts?: Record<string, number>; // Structured mapping of flavour IDs to counts
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'id' | 'flavor_breakdown'> & { flavor_breakdown?: string, flavor_counts?: Record<string, number> }) => void;
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
    
  }, [cartItems]); // Only depend on cartItems for this effect

  // Separate effect for pricing updates to avoid circular dependency
  useEffect(() => {
    // Apply appropriate pricing based on tier
    updatePricing();
    console.log('[Effect] Finished updating pricing.'); 
  }, [totalBottles, currentTier]); // Depend on tier and totalBottles instead of cartItems

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
        // Always update the price based on current tier to ensure consistency
        changed = true;
        return { ...item, pricePerUnit: unitPrice };
      });
      console.log('[updatePricing] Items after potential update:', updatedItems);

      // Only update state if there are items in the cart
      if (updatedItems.length === 0) {
         console.log('[updatePricing] Empty cart, skipping setCartItems.');
         return currentItems; // Return original items (same reference)
      }

      console.log('[updatePricing] Returning updated items with new prices.');
      return updatedItems; // Return the new array with updated prices
    });
  };

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('obexCart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (itemToAdd: Omit<CartItem, 'id' | 'flavor_breakdown'> & { flavor_breakdown?: string, flavor_counts?: Record<string, number> }) => {
    console.log('[addToCart] Called with item:', itemToAdd);
    
    setCartItems(prevItems => {
      console.log('[addToCart Update] Running with prevItems:', prevItems);
      console.log('[addToCart Update] Item to add quantity:', itemToAdd.quantity);

      // Check if the item with the specific flavour already exists
      const existingItem = prevItems.find(item => item.name === "ØBEX Reflux Relief" && item.flavor === itemToAdd.flavor);

      if (existingItem) {
        // Calculate the new quantity idempotently
        const newQuantity = existingItem.quantity + itemToAdd.quantity;
        console.log(`[addToCart Update] Existing flavour: ${existingItem.flavor}, Existing quantity: ${existingItem.quantity}, New calculated quantity: ${newQuantity}`);

        // Create flavour counts object
        const flavorName = itemToAdd.flavor;
        const flavorId = FLAVORS.find(f => f.name === flavorName)?.id || 'default';
        const flavorCounts = existingItem.flavor_counts ? { ...existingItem.flavor_counts } : {};
        flavorCounts[flavorId] = (flavorCounts[flavorId] || 0) + itemToAdd.quantity;

        // Create a readable breakdown
        const flavorBreakdown = Object.entries(flavorCounts)
          .map(([id, count]) => {
            const name = FLAVORS.find(f => f.id === id)?.name || id;
            return `${name}: ${count}`;
          })
          .join(', ');

        // Return a new array with the updated item
        const updatedItems = prevItems.map(item =>
          item.id === existingItem.id
            ? {
                ...item,
                quantity: newQuantity,
                priceId: itemToAdd.priceId, // Ensure priceId is updated if needed
                pricePerUnit: itemToAdd.pricePerUnit, // Carry over initial price, useEffect will adjust
                flavor_breakdown: flavorBreakdown,
                flavor_counts: flavorCounts
              }
            : item
        );
        toast.success(`Added ${itemToAdd.quantity} ${itemToAdd.flavor} bottle(s). Total: ${newQuantity}`);
        console.log('[addToCart Update] Returning updated item list:', updatedItems);
        return updatedItems;

      } else {
        // Create flavour counts for a new item
        const flavorName = itemToAdd.flavor;
        const flavorId = FLAVORS.find(f => f.name === flavorName)?.id || 'default';
        const flavorCounts = { [flavorId]: itemToAdd.quantity };

        // Create a readable breakdown
        const flavorBreakdown = `${flavorName}: ${itemToAdd.quantity}`;

        // Add the new item with its specific flavour to the cart
        const newItem: CartItem = {
          ...itemToAdd,
          id: `obex-${itemToAdd.flavor.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`, // Unique ID including flavour
          name: "ØBEX Reflux Relief",      // Ensure consistent name
          flavor_breakdown: flavorBreakdown,
          flavor_counts: flavorCounts
        };
        toast.success(`Added ${itemToAdd.quantity} ${itemToAdd.flavor} bottle(s) to cart`);
        console.log('[addToCart Update] Adding new item:', newItem);
        return [...prevItems, newItem];
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
      setCartItems(prevItems => {
        return prevItems.map(item => {
          if (item.id === itemId) {
            // Update the flavor_counts with the new quantity
            const flavorCounts = item.flavor_counts || {};
            
            // If we have a single flavour, update its count
            if (Object.keys(flavorCounts).length === 1) {
              const flavorId = Object.keys(flavorCounts)[0];
              flavorCounts[flavorId] = quantity;
            } 
                          // If multiple flavours, adjust proportionally
            else if (Object.keys(flavorCounts).length > 1) {
              const totalCurrentCount = Object.values(flavorCounts).reduce((sum, count) => sum + count, 0);
              if (totalCurrentCount > 0) {
                Object.keys(flavorCounts).forEach(flavorId => {
                  const ratio = flavorCounts[flavorId] / totalCurrentCount;
                  flavorCounts[flavorId] = Math.round(ratio * quantity);
                });
                
                // Adjust for rounding errors
                const newTotal = Object.values(flavorCounts).reduce((sum, count) => sum + count, 0);
                if (newTotal !== quantity) {
                  const diff = quantity - newTotal;
                  const firstFlavorId = Object.keys(flavorCounts)[0];
                  flavorCounts[firstFlavorId] += diff;
                }
              }
            }
            
                          // Generate updated flavour breakdown text
            const flavorBreakdown = Object.entries(flavorCounts)
              .map(([id, count]) => {
                const name = FLAVORS.find(f => f.id === id)?.name || id;
                return `${name}: ${count}`;
              })
              .join(', ');
              
            return { 
              ...item, 
              quantity, 
              flavor_breakdown: flavorBreakdown,
              flavor_counts: flavorCounts
            };
          }
          return item;
        });
      });
    }
  };

  const updateFlavors = (itemId: string, flavors: FlavorCounts) => {
    setCartItems(prevItems => prevItems.map(item => {
      if (item.id === itemId) {
        // Generate a human-readable flavour string
        const flavorString = Object.entries(flavors)
          .filter(([_, count]) => count > 0)
          .map(([flavorId, count]) => {
            const flavorName = FLAVORS.find(f => f.id === flavorId)?.name || flavorId;
            return `${flavorName} (${count})`;
          })
          .join(', ');
        
        // Create a readable breakdown for display
        const flavorBreakdown = Object.entries(flavors)
          .filter(([_, count]) => count > 0)
          .map(([flavorId, count]) => {
            const flavorName = FLAVORS.find(f => f.id === flavorId)?.name || flavorId;
            return `${flavorName}: ${count}`;
          })
          .join(', ');
        
        return { 
          ...item, 
          flavor: flavorString,
          flavor_breakdown: flavorBreakdown,
          flavor_counts: { ...flavors } // Store structured flavour data
        };
      }
      return item;
    }));
    
          toast.success('Updated flavour selection');
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared');
  };

  const getCartTotal = (): number => {
    // Use the current unit price based on tier to calculate cart total
    return cartItems.reduce((total, item) => {
      // Calculate price based on current tier discount
      return total + item.pricePerUnit * item.quantity;
    }, 0);
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