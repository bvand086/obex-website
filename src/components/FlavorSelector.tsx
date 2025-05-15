"use client";

import React, { useState, useEffect } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Available flavors and their display info
export const FLAVORS = [
  { id: 'mint', name: 'Smooth Mint', color: 'green', bgColor: '#2A9D8F', textColor: '#FFFFFF' },
  { id: 'lemon', name: 'Lemon Meringue', color: 'yellow', bgColor: '#E9C46A', textColor: '#264653' },
  { id: 'orange', name: 'Orange Cream', color: 'orange', bgColor: '#F4A261', textColor: '#264653' }
];

export interface FlavorCounts {
  [key: string]: number;
}

interface FlavorSelectorProps {
  bundleSize: number;
  initialFlavors?: FlavorCounts;
  onCancel: () => void;
  onConfirm: (selectedFlavors: FlavorCounts) => void;
  isOpen: boolean;
  isConfirmation?: boolean;
}

const FlavorSelector: React.FC<FlavorSelectorProps> = ({ 
  bundleSize, 
  initialFlavors,
  onCancel, 
  onConfirm, 
  isOpen,
  isConfirmation = false
}) => {
  const [selectedFlavors, setSelectedFlavors] = useState<FlavorCounts>({});
  const [error, setError] = useState<string | null>(null);

  // Calculate total flavors selected
  const totalSelected = Object.values(selectedFlavors).reduce((sum, count) => sum + count, 0);
  
  // Initialize with equal distribution of flavors or use provided initialFlavors
  useEffect(() => {
    if (isOpen) {
      if (initialFlavors && Object.keys(initialFlavors).length > 0) {
        setSelectedFlavors(initialFlavors);
      } else {
        // Auto-fill with even distribution, extras go to first flavors
        const flavorCount = FLAVORS.length;
        const baseAmount = Math.floor(bundleSize / flavorCount);
        const remainder = bundleSize % flavorCount;
        
        const distribution: FlavorCounts = {};
        FLAVORS.forEach((flavor, index) => {
          distribution[flavor.id] = baseAmount + (index < remainder ? 1 : 0);
        });
        
        setSelectedFlavors(distribution);
      }
      setError(null);
    }
  }, [bundleSize, initialFlavors, isOpen]);

  const handleIncrement = (flavorId: string) => {
    if (totalSelected < bundleSize) {
      setSelectedFlavors(prev => ({
        ...prev,
        [flavorId]: (prev[flavorId] || 0) + 1
      }));
      setError(null);
    } else {
      setError(`You've reached the maximum of ${bundleSize} bottles for this bundle`);
    }
  };

  const handleDecrement = (flavorId: string) => {
    if (selectedFlavors[flavorId] > 0) {
      setSelectedFlavors(prev => ({
        ...prev,
        [flavorId]: prev[flavorId] - 1
      }));
      setError(null);
    }
  };

  const handleConfirm = () => {
    if (totalSelected !== bundleSize) {
      setError(`Please select exactly ${bundleSize} bottles (${totalSelected} selected)`);
      return;
    }
    onConfirm(selectedFlavors);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-auto p-6 shadow-xl border border-[#2A9D8F]/20">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-[#2A9D8F]/5 rounded-br-[100px] -translate-x-10 -translate-y-10 blur-md"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#E9C46A]/5 rounded-tl-[100px] translate-x-10 translate-y-10 blur-md"></div>
        
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        
        <div className="relative">
          <h2 className="text-2xl font-bold text-[#264653] mb-2">
            {isConfirmation ? 'Confirm Your Flavors' : 'Choose Your Flavors'}
          </h2>
          <p className="text-gray-600 mb-6">
            {isConfirmation 
              ? `Please confirm the flavors for your ${bundleSize}-bottle bundle before checkout`
              : `Select how many of each flavor you'd like in your ${bundleSize}-bottle bundle`
            }
          </p>
          
          {isConfirmation && (
            <div className="mb-4 bg-blue-50 border border-blue-200 rounded-md p-3 text-blue-700 text-sm">
              <p>This is your final chance to verify your flavor selection before checkout. Please ensure your selection is correct.</p>
            </div>
          )}
          
          <div className="space-y-4 mb-8">
            {FLAVORS.map((flavor) => {
              const count = selectedFlavors[flavor.id] || 0;
              
              return (
                <div 
                  key={flavor.id} 
                  className="relative overflow-hidden rounded-lg border border-[#2A9D8F]/10 transition-all duration-300 hover:shadow-md group"
                  style={{ background: `linear-gradient(to right, ${flavor.bgColor}15, white)` }}
                >
                  {/* Animated highlight on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-[#2A9D8F]/0 via-white/30 to-[#2A9D8F]/0 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out pointer-events-none"></div>
                  
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center mr-3 transition-transform group-hover:scale-110 duration-300" 
                        style={{ background: flavor.bgColor, color: flavor.textColor }}
                      >
                        {count}
                      </div>
                      <h3 className="font-medium" style={{ color: flavor.bgColor }}>
                        {flavor.name}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDecrement(flavor.id)}
                        className={`h-8 w-8 rounded-full border-[${flavor.bgColor}]/30 hover:bg-[${flavor.bgColor}]/10 hover:text-[${flavor.bgColor}]`}
                        disabled={count <= 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-6 text-center font-medium">{count}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleIncrement(flavor.id)}
                        className={`h-8 w-8 rounded-full border-[${flavor.bgColor}]/30 hover:bg-[${flavor.bgColor}]/10 hover:text-[${flavor.bgColor}]`}
                        disabled={totalSelected >= bundleSize}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">Total Selected:</span>
            <div className="flex items-center bg-[#2A9D8F]/10 px-3 py-1 rounded-full">
              <span className="font-bold text-[#2A9D8F]">{totalSelected}</span>
              <span className="text-gray-500 mx-1">of</span>
              <span className="font-bold text-[#2A9D8F]">{bundleSize}</span>
            </div>
          </div>
          
          {error && (
            <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm animate-pulse">
              {error}
            </div>
          )}
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-[#264653]/20 text-[#264653] hover:bg-[#264653]/5"
            >
              {isConfirmation ? 'Skip' : 'Cancel'}
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-gradient-to-r from-[#2A9D8F] to-[#264653] hover:from-[#264653] hover:to-[#2A9D8F] text-white transition-all duration-300 transform hover:scale-[1.02]"
              disabled={totalSelected !== bundleSize}
            >
              {isConfirmation ? 'Confirm Flavors' : 'Confirm'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlavorSelector; 