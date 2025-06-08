"use client";

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import FlavorSelector, { FlavorCounts, FLAVORS } from '@/components/FlavorSelector';
import TierMessage from '@/components/cart/TierMessage';
import FreeShippingBanner from '@/components/cart/FreeShippingBanner';
import CartItem from '@/components/cart/CartItem';
import CouponSection from '@/components/cart/CouponSection';
import OrderSummary from '@/components/cart/OrderSummary';
import ShippingNotice from '@/components/cart/ShippingNotice';

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

  return (
    <div className="p-6">
      <TierMessage totalBottles={totalBottles} currentTier={currentTier} />
      <FreeShippingBanner 
        freeShippingUnlocked={freeShippingUnlocked} 
        bottlesUntilFreeShipping={bottlesUntilFreeShipping} 
      />
      
      <div className="space-y-6">
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onQuantityChange={handleQuantityChange}
            onRemoveItem={handleRemoveItem}
            onEditFlavors={handleEditFlavors}
            getTierDiscount={getTierDiscount}
            freeShippingUnlocked={freeShippingUnlocked}
          />
        ))}
      </div>

      <div className="mt-8 border-t pt-6">
        <CouponSection
          couponCode={couponCode}
          onCouponChange={handleCouponChange}
          onValidateCoupon={validateCoupon}
          validatingCoupon={validatingCoupon}
          couponError={couponError}
          couponSuccess={couponSuccess}
        />
        
        <OrderSummary
          totalBottles={totalBottles}
          cartTotal={getCartTotal()}
          getTierDiscount={getTierDiscount}
          currentTier={currentTier}
          freeShippingUnlocked={freeShippingUnlocked}
          appliedDiscount={appliedDiscount}
          discountedTotal={calculateDiscountedTotal()}
        />
        
        <ShippingNotice />
        
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