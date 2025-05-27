"use client";

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, Check, AlertCircle, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import FlavorSelector, { FlavorCounts, FLAVORS } from '@/components/FlavorSelector';

// Helper function to parse cart item flavour string to FlavorCounts
const parseCartItemFlavorToCounts = (itemFlavor: string, itemQuantity: number): FlavorCounts => {
  const counts: FlavorCounts = {};
  let parsedCountTotal = 0;

  // Try to parse "Flavour Name (count), Another (count)"
  const complexParts = itemFlavor.split(', ');
  const entryPattern = /(.+?)\s\((\d+)\)/; // Non-greedy name, then count

  for (const part of complexParts) {
    const match = part.match(entryPattern);
    if (match) {
      const name = match[1].trim();
      const count = parseInt(match[2], 10);
      const flavorDetail = FLAVORS.find(f => f.name === name);
      if (flavorDetail) {
        counts[flavorDetail.id] = (counts[flavorDetail.id] || 0) + count;
        parsedCountTotal += count;
      } else {
         console.warn(`Parsed flavour name "${name}" not found in FLAVORS list.`);
      }
    }
  }

  // If complex parsing successfully accounts for the itemQuantity, use those counts.
  if (parsedCountTotal === itemQuantity && Object.keys(counts).length > 0) {
    return counts;
  }

      // If not fully parsed by complex (or not complex at all), try as a simple flavour name.
  const singleFlavorDetail = FLAVORS.find(f => f.name === itemFlavor);
  if (singleFlavorDetail) {
    return { [singleFlavorDetail.id]: itemQuantity };
  }
  
        console.warn(`Could not parse flavour string "${itemFlavor}" for quantity ${itemQuantity}. FlavorSelector will use default distribution.`);
  return {}; 
};

export default function CartDisplay() {
  const { cartItems, removeFromCart, updateQuantity, updateFlavors, getCartTotal, freeShippingUnlocked, bottlesUntilFreeShipping, totalBottles, getDiscountPercent, currentTier, getUnitPrice } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [confirmingItemId, setConfirmingItemId] = useState<string | null>(null);
  const [currentConfirmIndex, setCurrentConfirmIndex] = useState<number>(0);
  const [confirmedItems, setConfirmedItems] = useState<string[]>([]);
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    percentOff?: number;
    amountOff?: number;
    currency?: string;
  } | null>(null);

  // Get discount percentage for items
  const getTierDiscount = (): number => {
    return getDiscountPercent();
  };

  // Get the current unit price
  const getCurrentUnitPrice = (): number => {
    return getUnitPrice();
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
    toast.success('Item removed from cart');
  };

  const handleEditFlavors = (itemId: string) => {
    setEditingItemId(itemId);
  };

  const handleFlavorUpdate = (flavors: FlavorCounts) => {
    if (editingItemId) {
      updateFlavors(editingItemId, flavors);
      setEditingItemId(null);
    }
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
          // Start the flavour confirmation process instead of proceeding directly to checkout
    if (cartItems.length > 0) {
      setCurrentConfirmIndex(0);
      setConfirmedItems([]);
      setConfirmingItemId(cartItems[0].id);
    } else {
      toast.error('Your cart is empty');
    }
  };

  const handleConfirmFlavor = (flavors: FlavorCounts) => {
    // Update the flavors for the confirming item
    if (confirmingItemId) {
      updateFlavors(confirmingItemId, flavors);
      
      // Add this item to the confirmed list
      setConfirmedItems(prev => [...prev, confirmingItemId]);
      
      // Move to the next item or proceed to checkout if all items are confirmed
      const nextIndex = currentConfirmIndex + 1;
      if (nextIndex < cartItems.length) {
        setCurrentConfirmIndex(nextIndex);
        setConfirmingItemId(cartItems[nextIndex].id);
      } else {
        // All items confirmed, proceed to actual checkout
        setConfirmingItemId(null);
        proceedToCheckout();
      }
    }
  };

  const handleSkipFlavor = () => {
            // Skip flavour confirmation for this item but add it to confirmed list
    if (confirmingItemId) {
      setConfirmedItems(prev => [...prev, confirmingItemId]);
      
      // Move to the next item or proceed to checkout if all items are confirmed
      const nextIndex = currentConfirmIndex + 1;
      if (nextIndex < cartItems.length) {
        setCurrentConfirmIndex(nextIndex);
        setConfirmingItemId(cartItems[nextIndex].id);
      } else {
        // All items confirmed, proceed to actual checkout
        setConfirmingItemId(null);
        proceedToCheckout();
      }
    }
  };

  const proceedToCheckout = async () => {
    setIsLoading(true);
    try {
      // Validate cart items have valid price IDs before proceeding
      const invalidItems = cartItems.filter(item => !item.priceId || item.priceId.trim() === '');
      if (invalidItems.length > 0) {
        throw new Error('Some items in your cart have invalid price IDs. Please try adding them again.');
      }
      
      // Create checkout items with detailed flavour breakdown
      const checkoutItems = cartItems.map(item => {
        // Parse flavour information into a structured format
        const flavorCounts = parseCartItemFlavorToCounts(item.flavor, item.quantity);
        
        // If flavorCounts is empty (couldn't parse the flavour string), use default distribution
        const finalFlavorCounts = Object.keys(flavorCounts).length === 0 
          ? FLAVORS.reduce((counts, flavor, index) => {
              const baseCount = Math.floor(item.quantity / FLAVORS.length);
              const remainder = item.quantity % FLAVORS.length;
              counts[flavor.id] = baseCount + (index < remainder ? 1 : 0);
              return counts;
            }, {} as FlavorCounts)
          : flavorCounts;

        // Create a readable flavour breakdown for shipping purposes
        const flavorBreakdown = Object.entries(finalFlavorCounts)
          .map(([flavorId, count]) => {
            const flavor = FLAVORS.find(f => f.id === flavorId);
            return flavor ? `${flavor.name}: ${count}` : null;
          })
          .filter(Boolean)
          .join(', ');

        return {
          priceId: item.priceId,
          quantity: item.quantity,
          flavorName: flavorBreakdown, // Use flavour breakdown instead of item.flavor
          free_shipping: freeShippingUnlocked,
          pricePerUnit: item.pricePerUnit,
          flavor_breakdown: flavorBreakdown,
          flavor_counts: finalFlavorCounts
        };
      });

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

  // Find the current item being edited
  const editingItem = editingItemId ? cartItems.find(item => item.id === editingItemId) : null;
  // Calculate bundle size if editing a bundle
  const editingBundleSize = editingItem ? editingItem.quantity : 0;

          // Calculate initialFlavorCounts for the FlavorSelector
  let initialFlavorCounts: FlavorCounts = {};
  if (editingItem) {
    initialFlavorCounts = parseCartItemFlavorToCounts(editingItem.flavor, editingItem.quantity);
  }

  // Get the appropriate tier message and colors
  const tierBgColor = currentTier === 'premium' ? 'bg-[#2A9D8F]/10' : currentTier === 'value' ? 'bg-[#F4A261]/10' : '';
  const tierTextColor = currentTier === 'premium' ? 'text-[#2A9D8F]' : currentTier === 'value' ? 'text-[#F4A261]' : '';
  const tierMessage = currentTier === 'premium' 
    ? "You've reached the Premium tier (20% off + $6.29 flat-rate shipping)" 
    : currentTier === 'value' 
      ? "You've reached the Value tier (14% off)" 
      : "Add more bottles for discounts";

  // Get the border color based on tier
  const getTierBorderColor = () => {
    if (currentTier === 'premium') return 'border-[#2A9D8F]/30';
    if (currentTier === 'value') return 'border-[#F4A261]/30';
    return 'border-[#E9C46A]/30';
  };

  return (
    <div className="p-6">
      {/* Tier Message */}
      {totalBottles > 0 && (
        <div className={`mb-6 p-3 rounded-lg text-center border ${tierBgColor} ${tierTextColor} ${getTierBorderColor()}`}>
          <div className="flex items-center justify-center">
            {currentTier === 'premium' && <Check className="h-5 w-5 mr-2 text-[#2A9D8F]" />}
            <span className="font-medium">{tierMessage}</span>
          </div>
        </div>
      )}
      
      {/* Free Shipping Banner */}
      <div className={`mb-6 p-3 rounded-lg text-center ${freeShippingUnlocked 
        ? 'bg-green-50 border border-green-200 text-green-700' 
        : 'bg-gray-50 border border-gray-200 text-gray-600'}`}>
        {freeShippingUnlocked ? (
          <div className="flex items-center justify-center">
            <Check className="h-5 w-5 mr-2 text-green-500" />
            <span className="font-medium">$6.29 flat-rate shipping unlocked ✓</span>
          </div>
        ) : (
          <span>Add {bottlesUntilFreeShipping} more {bottlesUntilFreeShipping === 1 ? 'bottle' : 'bottles'} for $6.29 flat-rate shipping</span>
        )}
      </div>
      
      <div className="space-y-6">
        {cartItems.map((item) => (
          <div key={item.id} className="p-4 bg-white rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.flavor}</p>
                <div className="flex items-center mt-1">
                  <p className="text-sm font-medium">${item.pricePerUnit.toFixed(2)} each × {item.quantity}</p>
                  {getTierDiscount() > 0 && (
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      {getTierDiscount()}% off
                    </span>
                  )}
                  {freeShippingUnlocked && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                      + $6.29 flat-rate shipping
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
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
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 ml-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Flavour Selection Button */}
            <div className="mt-3 pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditFlavors(item.id)}
                className="text-[#2A9D8F] hover:text-[#264653] bg-gradient-to-r from-[#2A9D8F]/5 to-[#E9C46A]/5 hover:bg-gradient-to-r hover:from-[#2A9D8F]/10 hover:to-[#E9C46A]/10 w-full relative overflow-hidden group border-[#2A9D8F]/20 hover:border-[#2A9D8F]/50 transition-all duration-300"
              >
                <div className="absolute inset-0 w-3 bg-gradient-to-r from-[#2A9D8F]/30 to-[#E9C46A]/30 -translate-x-full group-hover:translate-x-[800px] transition-all duration-1500 ease-in-out"></div>
                <Palette className="h-4 w-4 mr-2 text-[#E9C46A]" />
                <span className="font-medium">Choose Flavours</span>
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
            <span className="text-gray-600">Subtotal ({totalBottles} {totalBottles === 1 ? 'bottle' : 'bottles'})</span>
            <span>${getCartTotal().toFixed(2)}</span>
          </div>
          
          {/* Volume Discount Section */}
          {getTierDiscount() > 0 && (
            <div className="flex justify-between mb-2 text-green-600">
              <span className="flex items-center">
                <span>{currentTier === 'premium' ? 'Premium' : 'Value'} Tier Discount</span>
                <span className="ml-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  {getTierDiscount()}% off
                </span>
              </span>
              <span>
                (Included in price)
              </span>
            </div>
          )}

          {/* Free Shipping Badge */}
          {freeShippingUnlocked && (
            <div className="flex justify-between mb-2 text-blue-600">
              <span>Shipping</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">$6.29 FLAT RATE</span>
            </div>
          )}
          
          {/* Coupon Discount */}
          {appliedDiscount && (
            <div className="flex justify-between mb-2 text-green-600">
              <span>Coupon Discount</span>
              <span>
                {appliedDiscount.percentOff 
                  ? `-$${((getCartTotal() * appliedDiscount.percentOff) / 100).toFixed(2)}`
                  : appliedDiscount.amountOff 
                    ? `-$${(appliedDiscount.amountOff / 100).toFixed(2)}` 
                    : '$0.00'
                }
              </span>
            </div>
          )}

          <div className="border-t mt-2 pt-2 flex justify-between font-medium">
            <span>Total</span>
            <span>${calculateDiscountedTotal().toFixed(2)}</span>
          </div>

          {/* Volume Discount Tiers Information */}
          <div className="mt-4 pt-4 border-t border-dashed">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Volume Discount Tiers</h4>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>1-2 bottles</span>
                <span>$28.99 each</span>
              </div>
              <div className={`flex justify-between ${currentTier === 'value' ? 'font-medium text-green-700' : ''}`}>
                <span>3-5 bottles (Value Tier)</span>
                <span className="flex items-center">
                  $24.99 each
                  <span className="ml-1 bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full text-[10px]">
                    14% off
                  </span>
                </span>
              </div>
              <div className={`flex justify-between ${currentTier === 'premium' ? 'font-medium text-green-700' : ''}`}>
                <span>6+ bottles (Premium Tier)</span>
                <span className="flex items-center">
                  $23.33 each
                  <span className="ml-1 bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full text-[10px]">
                    20% off
                  </span>
                  <span className="ml-1 bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full text-[10px]">
                    + $6.29 ship
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Canadian Shipping Notice */}
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Shipping Restriction
              </h3>
              <div className="mt-1 text-sm text-red-700">
                <p>ØBEX products are currently only available for delivery within Canada. International shipping is not available at this time.</p>
                <p className="mt-1">
                  Questions? Contact us at{' '}
                  <a href="mailto:support@obexcanada.com" className="underline hover:text-red-900">
                    support@obexcanada.com
                  </a>
                </p>
              </div>
            </div>
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

      {/* Flavour Selector Modal for Editing */}
      {editingItemId && editingItem && (
        <FlavorSelector
          bundleSize={editingItem.quantity}
          initialFlavors={initialFlavorCounts}
          onCancel={() => setEditingItemId(null)}
          onConfirm={handleFlavorUpdate}
          isOpen={!!editingItemId}
        />
      )}

      {/* Flavour Confirmation Modal before Checkout */}
      {confirmingItemId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-auto p-6 shadow-xl border border-[#2A9D8F]/20">
            <div className="mb-4 text-center">
              <h2 className="text-xl font-bold text-[#264653]">Confirm Your Flavours</h2>
              <p className="text-sm text-gray-600">Item {currentConfirmIndex + 1} of {cartItems.length}</p>
            </div>
            
            {(() => {
              const confirmingItem = cartItems.find(item => item.id === confirmingItemId);
              if (!confirmingItem) return null;
              
              const confirmFlavorCounts = parseCartItemFlavorToCounts(confirmingItem.flavor, confirmingItem.quantity);
              
              return (
                <FlavorSelector
                  bundleSize={confirmingItem.quantity}
                  initialFlavors={confirmFlavorCounts}
                  onCancel={handleSkipFlavor}
                  onConfirm={handleConfirmFlavor}
                  isOpen={true}
                  isConfirmation={true}
                />
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
} 