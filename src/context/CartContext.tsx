"use client";

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { toast } from 'react-hot-toast';

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
  clearCart: () => void;
  getCartTotal: () => number;
  itemCount: number;
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

  // Update item count whenever cart changes
  useEffect(() => {
    const count = cartItems.reduce((total: number, item: CartItem) => total + item.quantity, 0);
    setItemCount(count);
  }, [cartItems]);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('obexCart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (itemToAdd: Omit<CartItem, 'id'>) => {
    setCartItems((prevItems: CartItem[]) => {
      const existingItem = prevItems.find(item => item.priceId === itemToAdd.priceId);
      
      if (existingItem) {
        // Increase quantity if item already exists
        const updatedItems = prevItems.map((item: CartItem) =>
          item.priceId === itemToAdd.priceId
            ? { ...item, quantity: item.quantity + itemToAdd.quantity }
            : item
        );
        toast.success(`Updated ${itemToAdd.flavor} quantity in cart`);
        return updatedItems;
      } else {
        // Add new item
        const newItem = { ...itemToAdd, id: itemToAdd.priceId };
        toast.success(`Added ${itemToAdd.flavor} to cart`);
        return [...prevItems, newItem];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prevItems: CartItem[]) => {
      const itemToRemove = prevItems.find(item => item.id === itemId);
      if (itemToRemove) {
        toast.success(`Removed ${itemToRemove.flavor} from cart`);
      }
      return prevItems.filter((item: CartItem) => item.id !== itemId);
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems((prevItems: CartItem[]) =>
        prevItems.map((item: CartItem) =>
          item.id === itemId ? { ...item, quantity: quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared');
  };

  const getCartTotal = (): number => {
    return cartItems.reduce((total: number, item: CartItem) => total + item.pricePerUnit * item.quantity, 0);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        getCartTotal,
        itemCount
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