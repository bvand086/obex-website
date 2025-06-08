import Stripe from 'stripe';

export function getShippingOptions(hasFreeShipping: boolean): Stripe.Checkout.SessionCreateParams.ShippingOption[] {
  if (hasFreeShipping) {
    // Premium Tier: Standard is free, Express is an upgrade cost
    return [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 0, // $0.00 for standard
            currency: 'cad',
          },
          display_name: 'Standard Shipping (Included)',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 5 },
            maximum: { unit: 'business_day', value: 10 },
          },
        },
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 669, // $6.69 for express upgrade
            currency: 'cad',
          },
          display_name: 'Express Shipping (Upgrade)',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 1 },
            maximum: { unit: 'business_day', value: 3 },
          },
        },
      },
    ];
  } else {
    // Starter/Value Tiers: Regular shipping prices
    return [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 629, // $6.29 standard shipping fee
            currency: 'cad',
          },
          display_name: 'Standard Shipping',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 5 },
            maximum: { unit: 'business_day', value: 10 },
          },
        },
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 1299, // $12.99 express shipping fee
            currency: 'cad',
          },
          display_name: 'Express Shipping',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 1 },
            maximum: { unit: 'business_day', value: 3 },
          },
        },
      },
    ];
  }
}