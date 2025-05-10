"use client";

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

export default function CartDisplay() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    percentOff?: number;
    amountOff?: number;
    currency?: string;
  } | null>(null);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
    toast.success('Item removed from cart');
  };

  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponCode(e.target.value);
    setCouponError('');
    setCouponSuccess('');
  };

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a discount code');
      return;
    }

    setValidatingCoupon(true);
    setCouponError('');
    setCouponSuccess('');
    setAppliedDiscount(null);

    try {
      const response = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: couponCode.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setCouponError(data.error || 'Invalid discount code');
        return;
      }

      if (data.valid) {
        setCouponSuccess(`${couponCode} applied!`);
        setAppliedDiscount({
          code: couponCode,
          percentOff: data.percentOff,
          amountOff: data.amountOff,
          currency: data.currency,
        });
        toast.success(`Discount code applied: ${couponCode}`);
      } else {
        setCouponError(data.message || 'Invalid discount code');
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      setCouponError('Error validating discount code');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const calculateDiscountedTotal = () => {
    const subtotal = getCartTotal();
    
    if (!appliedDiscount) return subtotal;
    
    if (appliedDiscount.percentOff) {
      const discount = subtotal * (appliedDiscount.percentOff / 100);
      return subtotal - discount;
    }
    
    if (appliedDiscount.amountOff) {
      // Amount off is stored in cents, convert to dollars
      const amountOff = appliedDiscount.amountOff / 100;
      return Math.max(0, subtotal - amountOff);
    }
    
    return subtotal;
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      // Validate cart items have valid price IDs before proceeding
      const invalidItems = cartItems.filter(item => !item.priceId || item.priceId.trim() === '');
      if (invalidItems.length > 0) {
        throw new Error('Some items in your cart have invalid price IDs. Please try adding them again.');
      }
      
      const checkoutItems = cartItems.map(item => ({
        priceId: item.priceId,
        quantity: item.quantity,
        flavorName: item.flavor
      }));

      const requestData = {
        cartItems: checkoutItems,
        couponCode: appliedDiscount?.code || couponCode.trim() || undefined
      };

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { checkoutUrl } = await response.json();
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error('Checkout URL not received');
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error(`Checkout failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">Your cart is empty</p>
        <Button variant="outline" asChild>
          <a href="/">Continue Shopping</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.flavor}</p>
              <p className="text-sm font-medium">${item.pricePerUnit.toFixed(2)}</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  className="h-8 w-8"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  className="h-8 w-8"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveItem(item.id)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-t pt-6">
        {/* Coupon Code Section */}
        <div className="mb-6">
          <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-2">
            Discount Code
          </label>
          <div className="flex space-x-2">
            <Input
              id="coupon"
              type="text"
              placeholder="Enter discount code"
              value={couponCode}
              onChange={handleCouponChange}
              className="flex-1"
            />
            <Button 
              onClick={validateCoupon} 
              disabled={validatingCoupon}
              className="bg-[#2A9D8F] hover:bg-[#264653] text-white min-w-[80px]"
            >
              {validatingCoupon ? "..." : "Apply"}
            </Button>
          </div>
          {couponError && (
            <div className="mt-2 flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              <p>{couponError}</p>
            </div>
          )}
          {couponSuccess && (
            <div className="mt-2 flex items-center text-sm text-green-600">
              <Check className="h-4 w-4 mr-1" />
              <p>{couponSuccess}</p>
            </div>
          )}
        </div>
        
        {/* Order Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-medium mb-3">Order Summary</h3>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          
          {appliedDiscount && (
            <div className="flex justify-between mb-2 text-green-600">
              <span>Discount ({appliedDiscount.percentOff ? `${appliedDiscount.percentOff}%` : `$${(appliedDiscount.amountOff || 0) / 100}`})</span>
              <span>-${(getCartTotal() - calculateDiscountedTotal()).toFixed(2)}</span>
            </div>
          )}
          
          <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-medium">
            <span>Total</span>
            <span>${calculateDiscountedTotal().toFixed(2)}</span>
          </div>
        </div>
        
        <Button 
          className="w-full bg-[#2A9D8F] hover:bg-[#264653] text-white"
          onClick={handleCheckout}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Proceed to Checkout'}
        </Button>
      </div>
    </div>
  );
} 