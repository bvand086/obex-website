import { Suspense } from 'react';
import SuccessPageClient from './SuccessPageClient';

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FAFAF9] to-[#F4F6F6]">
        <div className="max-w-md w-full space-y-8 p-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg relative">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-4"></div>
              <div className="h-4 w-64 bg-gray-200 rounded mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <SuccessPageClient />
    </Suspense>
  );
} 