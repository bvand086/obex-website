import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

interface CartItem {
  priceId: string;
  quantity: number;
  flavorName?: string;
  flavor_breakdown?: string; // JSON string of flavor counts
  free_shipping?: boolean;
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

    // ALTERNATIVE APPROACH: Don't use priceId but create a line item with adjustable pricing
    // This works in both test and live modes regardless of price ID existence
    const line_items = validCartItems.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: 'cad',
        product_data: {
          name: 'ØBEX Reflux Relief Bottle',
          description: `Flavor: ${item.flavorName || 'Not specified'}`,
          metadata: {
            flavor_breakdown: item.flavor_breakdown || '',
          },
        },
        unit_amount: 2899, // Amount in cents ($28.99)
      }
    }));

    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const success_url = `${origin}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = `${origin}/cancel`;

    // Prepare shipping options
    const shipping_options: Stripe.Checkout.SessionCreateParams.ShippingOption[] = [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 629, // $6.29 shipping fee
            currency: 'cad',
          },
          display_name: 'Standard Shipping',
          delivery_estimate: {
            minimum: {
              unit: 'business_day' as Stripe.Checkout.SessionCreateParams.ShippingOption.ShippingRateData.DeliveryEstimate.Minimum.Unit,
              value: 5,
            },
            maximum: {
              unit: 'business_day' as Stripe.Checkout.SessionCreateParams.ShippingOption.ShippingRateData.DeliveryEstimate.Maximum.Unit,
              value: 10,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 1299, // $12.99 shipping fee
            currency: 'cad',
          },
          display_name: 'Express Shipping',
          delivery_estimate: {
            minimum: {
              unit: 'business_day' as Stripe.Checkout.SessionCreateParams.ShippingOption.ShippingRateData.DeliveryEstimate.Minimum.Unit,
              value: 1,
            },
            maximum: {
              unit: 'business_day' as Stripe.Checkout.SessionCreateParams.ShippingOption.ShippingRateData.DeliveryEstimate.Maximum.Unit,
              value: 3,
            },
          },
        },
      },
    ];

    // Add free shipping option if eligible
    if (hasFreeShipping) {
      shipping_options.unshift({
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 699, // $6.99 free shipping rate
            currency: 'cad',
          },
          display_name: 'Free Shipping (6+ Bottles)',
          delivery_estimate: {
            minimum: {
              unit: 'business_day' as Stripe.Checkout.SessionCreateParams.ShippingOption.ShippingRateData.DeliveryEstimate.Minimum.Unit,
              value: 5,
            },
            maximum: {
              unit: 'business_day' as Stripe.Checkout.SessionCreateParams.ShippingOption.ShippingRateData.DeliveryEstimate.Maximum.Unit,
              value: 10,
            },
          },
        },
      });
    }

    // Prepare checkout session configuration
    const checkoutConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      success_url: success_url,
      cancel_url: cancel_url,
      shipping_address_collection: {
        allowed_countries: ['CA', 'US'],
      },
      shipping_options,
      metadata: {
        cart_details: JSON.stringify(validCartItems.map(item => ({
          flavor: item.flavorName,
          qty: item.quantity,
          flavor_breakdown: item.flavor_breakdown || '',
          free_shipping: item.free_shipping || false
        }))),
      },
    };

    // Apply coupon code if provided
    if (couponCode && couponCode.trim() !== '') {
      try {
        // First try to find it as a promotion code (customer-facing code)
        const promotionCodes = await stripe.promotionCodes.list({
          code: couponCode.trim(),
          active: true,
          limit: 1,
        });
        
        if (promotionCodes.data.length > 0) {
          // Found a valid promotion code
          checkoutConfig.discounts = [{ promotion_code: promotionCodes.data[0].id }];
          console.log(`Applied promotion code: ${couponCode} (${promotionCodes.data[0].id})`);
        } else {
          // If not found as promotion code, try as coupon (for backward compatibility)
          try {
            const coupon = await stripe.coupons.retrieve(couponCode.trim());
            checkoutConfig.discounts = [{ coupon: coupon.id }];
            console.log(`Applied direct coupon: ${couponCode}`);
          } catch (couponError) {
            console.error(`Coupon not found: ${couponCode}`, couponError);
          }
        }
      } catch (discountError) {
        // Log the error but continue with checkout without the coupon
        console.error(`Error processing discount code: ${couponCode}`, discountError);
      }
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