"use client";

import React from "react";

const ShippingNotice: React.FC = () => {
  return (
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
  );
};

export default ShippingNotice;