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

    const line_items = cartItems.map((item) => ({
      price: item.priceId,
      quantity: item.quantity,
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
      metadata: {
        cart_details: JSON.stringify(cartItems.map(item => ({
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