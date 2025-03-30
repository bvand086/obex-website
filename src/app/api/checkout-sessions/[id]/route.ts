import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Retrieve the Stripe checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'shipping_cost.shipping_rate'],
    });

    // Extract the relevant data
    const orderDetails = {
      id: session.id,
      status: session.status,
      customer_email: session.customer_details?.email,
      amount_subtotal: session.amount_subtotal,
      amount_total: session.amount_total,
      shipping_details: session.customer_details?.address ? {
        name: session.customer_details?.name,
        address: session.customer_details.address,
      } : undefined,
      shipping_cost: session.shipping_cost ? {
        amount_total: session.shipping_cost.amount_total,
        shipping_rate: session.shipping_cost.shipping_rate,
      } : undefined,
      shipping_rate: session.shipping_cost?.shipping_rate && 
        typeof session.shipping_cost.shipping_rate !== 'string' ? {
        display_name: session.shipping_cost.shipping_rate.display_name,
      } : undefined,
      items: session.line_items?.data.map(item => ({
        description: item.description,
        quantity: item.quantity,
        amount_total: item.amount_total,
      })),
      created: new Date(session.created * 1000).toISOString(),
    };

    return NextResponse.json(orderDetails);
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    
    if (error instanceof Stripe.errors.StripeInvalidRequestError) {
      return NextResponse.json({ error: 'Invalid session ID' }, { status: 400 });
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: `Failed to retrieve checkout session: ${errorMessage}` },
      { status: 500 }
    );
  }
} 