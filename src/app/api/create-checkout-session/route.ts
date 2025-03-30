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
}

export async function POST(request: NextRequest) {
  try {
    const cartItems = (await request.json()) as CartItem[];

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

    // ALTERNATIVE APPROACH: Don't use priceId but create a line item with adjustable pricing
    // This works in both test and live modes regardless of price ID existence
    const line_items = validCartItems.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency: 'cad',
        product_data: {
          name: 'ØBEX Reflux Relief Bottle',
          description: `Flavor: ${item.flavorName || 'Not specified'}`,
        },
        unit_amount: 2899, // Amount in cents ($28.99)
      },
    }));

    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const success_url = `${origin}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = `${origin}/cancel`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      success_url: success_url,
      cancel_url: cancel_url,
      shipping_address_collection: {
        allowed_countries: ['CA', 'US'],
      },
      shipping_options: [
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
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
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
                unit: 'business_day',
                value: 1,
              },
              maximum: {
                unit: 'business_day',
                value: 3,
              },
            },
          },
        },
      ],
      metadata: {
        cart_details: JSON.stringify(validCartItems.map(item => ({
          flavor: item.flavorName,
          qty: item.quantity
        }))),
      },
    });

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