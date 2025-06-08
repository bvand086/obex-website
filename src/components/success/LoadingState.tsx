"use client";

import React from "react";
import { Loader2 } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <Loader2 className="h-8 w-8 animate-spin text-[#2A9D8F]" />
      <span className="ml-2">Loading order details...</span>
    </div>
  );
};

export default LoadingState;