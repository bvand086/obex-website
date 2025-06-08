import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/checkout/stripeConfig';
import { getFlavorDetails } from '@/lib/checkout/flavorUtils';
import { getShippingOptions } from '@/lib/checkout/shippingOptions';
import { applyCouponToCheckout } from '@/lib/checkout/couponUtils';
import { generateMetadata } from '@/lib/checkout/metadataGenerator';

interface CartItem {
  priceId: string;
  quantity: number;
  flavorName?: string;
  flavor_breakdown?: string; // Readable breakdown of flavours (e.g. "Mint: 2, Cherry: 3")
  flavor_counts?: Record<string, number>; // Structured format of flavor IDs to quantities
  free_shipping?: boolean;
  pricePerUnit: number; // Added to receive discounted price from frontend
}

interface CheckoutRequest {
  cartItems: CartItem[];
  couponCode?: string;
}

export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json() as (CartItem[] | CheckoutRequest);
    
    // Handle both formats for backward compatibility
    let cartItems: CartItem[] = [];
    let couponCode: string | undefined;
    
    if (Array.isArray(requestData)) {
      // Old format: direct array of cart items
      cartItems = requestData;
    } else {
      // New format: object with cartItems and optional couponCode
      cartItems = requestData.cartItems;
      couponCode = requestData.couponCode;
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json({ error: 'Invalid cart data' }, { status: 400 });
    }

    // Filter out any items with empty or invalid priceIds
    const validCartItems = cartItems.filter(item => 
      item.priceId && typeof item.priceId === 'string' && item.priceId.trim() !== ''
    );

    if (validCartItems.length === 0) {
      return NextResponse.json({ 
        error: 'No valid items in cart. Please check product price IDs.' 
      }, { status: 400 });
    }

    // Check if any item has free shipping
    const hasFreeShipping = validCartItems.some(item => item.free_shipping === true);

    // Create line items with adjustable pricing
    const line_items = validCartItems.map((item) => {
      const flavorDetails = getFlavorDetails(item);

      return {
        quantity: item.quantity,
        price_data: {
          currency: 'cad',
          product_data: {
            name: `ØBEX Reflux Relief - SHIP: ${flavorDetails}`,
            description: `IMPORTANT - FLAVOURS TO SHIP: ${flavorDetails}`,
            metadata: {
              flavors_to_ship: flavorDetails || 'Not specified',
              flavor_counts: JSON.stringify(item.flavor_counts || {}),
              flavor_summary: `Total: ${item.quantity} bottles - ${flavorDetails}`
            },
          },
          unit_amount: Math.round(item.pricePerUnit * 100), // Use discounted price from frontend
        }
      };
    });

    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const success_url = `${origin}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = `${origin}/cancel`;

    // Get shipping options
    const shipping_options = getShippingOptions(hasFreeShipping);

    // Prepare checkout session configuration
    const checkoutConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      success_url: success_url,
      cancel_url: cancel_url,
      shipping_address_collection: {
        allowed_countries: ['CA'],
      },
      shipping_options,
      metadata: generateMetadata(validCartItems),
    };

    // Apply coupon code if provided
    if (couponCode) {
      await applyCouponToCheckout(couponCode, checkoutConfig);
    }

    const session = await stripe.checkout.sessions.create(checkoutConfig);

    if (session.url) {
      return NextResponse.json({ checkoutUrl: session.url }, { status: 200 });
    } else {
      throw new Error('Failed to create Stripe session URL.');
    }

  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: `Failed to create checkout session: ${errorMessage}` }, { status: 500 });
  }
} 