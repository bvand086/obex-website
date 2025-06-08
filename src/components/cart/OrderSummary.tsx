"use client";

import React from "react";

interface OrderSummaryProps {
  totalBottles: number;
  cartTotal: number;
  getTierDiscount: () => number;
  currentTier: string;
  freeShippingUnlocked: boolean;
  appliedDiscount: {
    code: string;
    percentOff?: number;
    amountOff?: number;
    currency?: string;
  } | null;
  discountedTotal: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  totalBottles,
  cartTotal,
  getTierDiscount,
  currentTier,
  freeShippingUnlocked,
  appliedDiscount,
  discountedTotal
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <h3 className="font-medium mb-3">Order Summary</h3>
      <div className="flex justify-between mb-2">
        <span className="text-gray-600">Subtotal ({totalBottles} {totalBottles === 1 ? 'bottle' : 'bottles'})</span>
        <span>${cartTotal.toFixed(2)}</span>
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
              ? `-$${((cartTotal * appliedDiscount.percentOff) / 100).toFixed(2)}`
              : appliedDiscount.amountOff 
                ? `-$${(appliedDiscount.amountOff / 100).toFixed(2)}` 
                : '$0.00'
            }
          </span>
        </div>
      )}

      <div className="border-t mt-2 pt-2 flex justify-between font-medium">
        <span>Total</span>
        <span>${discountedTotal.toFixed(2)}</span>
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
  );
};

export default OrderSummary;