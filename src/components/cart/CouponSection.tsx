"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, AlertCircle } from 'lucide-react';

interface CouponSectionProps {
  couponCode: string;
  onCouponChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValidateCoupon: () => void;
  validatingCoupon: boolean;
  couponError: string;
  couponSuccess: string;
}

const CouponSection: React.FC<CouponSectionProps> = ({
  couponCode,
  onCouponChange,
  onValidateCoupon,
  validatingCoupon,
  couponError,
  couponSuccess
}) => {
  return (
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
          onChange={onCouponChange}
          className="flex-1"
        />
        <Button 
          onClick={onValidateCoupon} 
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
  );
};

export default CouponSection;