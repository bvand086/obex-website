"use client";

import React from "react";
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const ErrorState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <p className="text-red-500 mb-4">Failed to load order details.</p>
      <Button asChild variant="outline">
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
};

export default ErrorState;