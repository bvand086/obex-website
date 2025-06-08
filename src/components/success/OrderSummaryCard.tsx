"use client";

import React from "react";

interface OrderDetails {
  id: string;
  amount_total: number;
  shipping_details?: {
    name: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
  shipping_cost?: {
    amount_total: number;
    shipping_rate: string;
  };
  shipping_rate?: {
    display_name: string;
  };
  items?: {
    description: string;
    quantity: number;
    amount_total: number;
  }[];
}

interface OrderSummaryCardProps {
  orderDetails: OrderDetails;
}

const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({ orderDetails }) => {
  return (
    <div className="space-y-6 text-left">
      <div className="border-b pb-4">
        <h2 className="text-lg font-semibold text-[#264653] mb-2">Order Summary</h2>
        <p className="text-sm text-gray-500">Order ID: {orderDetails.id}</p>
        <p className="text-sm text-gray-500">Total: ${(orderDetails.amount_total / 100).toFixed(2)} CAD</p>
        
        {orderDetails.shipping_cost && (
          <p className="text-sm text-gray-500">
            Shipping: ${(orderDetails.shipping_cost.amount_total / 100).toFixed(2)} CAD
            {orderDetails.shipping_rate?.display_name && ` (${orderDetails.shipping_rate.display_name})`}
          </p>
        )}
      </div>
      
      {orderDetails.shipping_details && (
        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold text-[#264653] mb-2">Shipping Details</h2>
          <p className="text-sm text-gray-500">{orderDetails.shipping_details.name}</p>
          <p className="text-sm text-gray-500">{orderDetails.shipping_details.address.line1}</p>
          {orderDetails.shipping_details.address.line2 && (
            <p className="text-sm text-gray-500">{orderDetails.shipping_details.address.line2}</p>
          )}
          <p className="text-sm text-gray-500">
            {orderDetails.shipping_details.address.city}, {orderDetails.shipping_details.address.state} {orderDetails.shipping_details.address.postal_code}
          </p>
          <p className="text-sm text-gray-500">{orderDetails.shipping_details.address.country}</p>
        </div>
      )}
      
      {orderDetails.items && orderDetails.items.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-[#264653] mb-2">Items</h2>
          <ul className="space-y-2">
            {orderDetails.items.map((item, index) => (
              <li key={index} className="text-sm text-gray-500">
                {item.quantity}x {item.description} - ${(item.amount_total / 100).toFixed(2)} CAD
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrderSummaryCard;