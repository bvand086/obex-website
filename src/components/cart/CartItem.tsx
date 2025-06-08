"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, Palette } from 'lucide-react';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    flavor: string;
    pricePerUnit: number;
    quantity: number;
  };
  onQuantityChange: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onEditFlavors: (itemId: string) => void;
  getTierDiscount: () => number;
  freeShippingUnlocked: boolean;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onQuantityChange,
  onRemoveItem,
  onEditFlavors,
  getTierDiscount,
  freeShippingUnlocked
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
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
              onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              className="h-8 w-8"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemoveItem(item.id)}
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
          onClick={() => onEditFlavors(item.id)}
          className="text-[#2A9D8F] hover:text-[#264653] bg-gradient-to-r from-[#2A9D8F]/5 to-[#E9C46A]/5 hover:bg-gradient-to-r hover:from-[#2A9D8F]/10 hover:to-[#E9C46A]/10 w-full relative overflow-hidden group border-[#2A9D8F]/20 hover:border-[#2A9D8F]/50 transition-all duration-300"
        >
          <div className="absolute inset-0 w-3 bg-gradient-to-r from-[#2A9D8F]/30 to-[#E9C46A]/30 -translate-x-full group-hover:translate-x-[800px] transition-all duration-1500 ease-in-out"></div>
          <Palette className="h-4 w-4 mr-2 text-[#E9C46A]" />
          <span className="font-medium">Choose Flavours</span>
        </Button>
      </div>
    </div>
  );
};

export default CartItem;