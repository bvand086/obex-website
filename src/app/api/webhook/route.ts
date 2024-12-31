import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';
import { headers } from 'next/headers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});
const resend = new Resend(process.env.RESEND_API_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// New App Router config syntax
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const preferredRegion = 'auto';
export const maxDuration = 10; // Ensure webhook has enough time to process

async function buffer(req: NextRequest) {
  const chunks = [];
  const reader = req.body!.getReader();
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(Buffer.from(value));
    }
    
    const rawBody = Buffer.concat(chunks);
    console.log('📦 Raw body size:', rawBody.length, 'bytes');
    console.log('🔍 First 100 bytes:', rawBody.toString('utf8').substring(0, 100));
    console.log('🔍 Last 100 bytes:', rawBody.toString('utf8').slice(-100));
    
    return rawBody;
  } catch (e) {
    console.error('❌ Buffer reading error:', e);
    throw e;
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await buffer(req);
    const sig = headers().get('stripe-signature');

    console.log('🔑 Stripe signature:', sig);

    if (!sig) {
      console.error('❌ No Stripe signature found in headers');
      return NextResponse.json({ error: 'No signature found' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      console.log('🔑 Webhook Secret (for verification):', webhookSecret); // Ensure this matches Stripe
      console.log('🔑 Stripe Signature Header:', sig);
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
      console.log('✅ Event verified:', event.id);
    } catch (err) {
      const error = err as Error;
      console.error('❌ Verification failed:', error);
      return NextResponse.json(
        { error: `Webhook Error: ${error.message}` },
        { status: 400 }
      );
    }

    // Successfully constructed event
    console.log('✅ Event details:', {
      id: event.id,
      type: event.type,
      apiVersion: event.api_version,
      created: new Date(event.created).toISOString()
    });

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('💳 Checkout session completed:', session.id);
        
        // Extract customer data
        const { 
          email: customerEmail, 
          name: customerName, 
          address 
        } = session.customer_details || {};
        const stripeCustomerId = session.customer;

        if (!customerEmail) {
          throw new Error('Customer email not found in session');
        }

        try {
          console.log('💫 Processing order for customer:', customerEmail);

          // Store customer in Supabase
          const { data: customer, error: customerError } = await supabase
            .from('customers')
            .upsert({
              stripe_customer_id: stripeCustomerId,
              email: customerEmail,
              name: customerName,
            })
            .select()
            .single();

          if (customerError) throw customerError;

          console.log('👤 Customer stored:', customer);

          // Store customer address in Supabase
          const { data: addressData, error: addressError } = await supabase
            .from('addresses')
            .insert({
              customer_id: customer.id,
              line1: address?.line1,
              line2: address?.line2,
              city: address?.city,
              state: address?.state,
              postal_code: address?.postal_code,
              country: address?.country,
            })
            .select()
            .single();

          if (addressError) throw addressError;

          console.log('📍 Address stored:', addressData);

          // Store order in Supabase
          const amountTotal = session.amount_total != null ? session.amount_total / 100 : 34.99;
          const { data: orderData, error: orderError } = await supabase
            .from('orders')
            .insert({
              stripe_order_id: session.id,
              customer_id: customer.id,
              address_id: addressData.id,
              amount_total: amountTotal,
              status: 'pending',
            })
            .select()
            .single();

          if (orderError) throw orderError;

          console.log('📦 Order stored:', orderData);

          // Send customer confirmation email
          await resend.emails.send({
            from: 'ØBEX <support@obexcanada.com>',
            to: [customerEmail], // Convert to array to satisfy type
            subject: 'Welcome to ØBEX - Order Confirmation',
            html: `
              <!DOCTYPE html>
              <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #ffffff;">
                  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <img src="https://obexcanada.com/OSlashLogo.png" alt="ØBEX Logo" style="width: 150px; margin-bottom: 30px;">
                    
                    <h1 style="color: #2A9D8F; margin-bottom: 25px;">Thank you for your ØBEX order!</h1>
                    
                    <p style="font-size: 16px; margin-bottom: 20px;">Dear ${customerName || 'Valued Customer'},</p>
                    
                    <p style="font-size: 16px; margin-bottom: 25px;">We're excited to confirm your order for the ØBEX Large Pack. Your natural solution for reflux relief is on its way!</p>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e9ecef;">
                      <h2 style="color: #2A9D8F; margin-top: 0; margin-bottom: 20px;">Order Details</h2>
                      <p style="margin: 10px 0;"><strong>Order ID:</strong> ${session.id}</p>
                      <p style="margin: 10px 0;"><strong>Product:</strong> ØBEX Large Pack (24 packets)</p>
                      <p style="margin: 10px 0;"><strong>Amount:</strong> $${amountTotal.toFixed(2)} CAD</p>
                    </div>
                    
                    <p style="font-size: 16px; margin-bottom: 15px;">Your order will be shipped to:</p>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e9ecef;">
                      ${address?.line1 || ''}<br>
                      ${address?.line2 ? address.line2 + '<br>' : ''}
                      ${address?.city || ''}, 
                      ${address?.state || ''} 
                      ${address?.postal_code || ''}<br>
                      ${address?.country || ''}
                    </div>
                    
                    <p style="font-size: 16px; margin-bottom: 30px;">If you have any questions about your order, please don't hesitate to contact us at <a href="mailto:support@obexcanada.com" style="color: #2A9D8F; text-decoration: none;">support@obexcanada.com</a></p>
                  </div>
                </body>
              </html>
            `
          });

          console.log('📧 Customer confirmation email sent');

          // Send internal notification email
          await resend.emails.send({
            from: 'ØBEX Orders <support@obexcanada.com>',
            to: ['obexincorporated@gmail.com'],
            subject: `New ØBEX Order - ${session.id}`,
            html: `
              <!DOCTYPE html>
              <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #ffffff;">
                  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #2A9D8F; margin-bottom: 25px;">New Order Received</h1>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e9ecef;">
                      <h2 style="color: #2A9D8F; margin-top: 0; margin-bottom: 20px;">Order Details</h2>
                      <p style="margin: 10px 0;"><strong>Order ID:</strong> ${session.id}</p>
                      <p style="margin: 10px 0;"><strong>Product:</strong> ØBEX Large Pack (24 packets)</p>
                      <p style="margin: 10px 0;"><strong>Amount:</strong> $${amountTotal.toFixed(2)} CAD</p>
                      <p style="margin: 10px 0;"><strong>Date:</strong> ${new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' })}</p>
                    </div>

                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e9ecef;">
                      <h2 style="color: #2A9D8F; margin-top: 0; margin-bottom: 20px;">Customer Information</h2>
                      <p style="margin: 10px 0;"><strong>Name:</strong> ${customerName || 'Not provided'}</p>
                      <p style="margin: 10px 0;"><strong>Email:</strong> ${customerEmail}</p>
                    </div>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e9ecef;">
                      <h2 style="color: #2A9D8F; margin-top: 0; margin-bottom: 20px;">Shipping Address</h2>
                      <p style="margin: 10px 0;">
                        ${address?.line1 || ''}<br>
                        ${address?.line2 ? address.line2 + '<br>' : ''}
                        ${address?.city || ''}, 
                        ${address?.state || ''} 
                        ${address?.postal_code || ''}<br>
                        ${address?.country || ''}
                      </p>
                    </div>

                    <p style="font-size: 16px; color: #666;">This order needs to be processed and shipped. Please update the customer with tracking information once shipped.</p>
                  </div>
                </body>
              </html>
            `
          });

          console.log('📧 Internal notification email sent');
          console.log('✅ Order processed successfully:', orderData);

        } catch (err) {
          console.error('❌ Error handling order:', err);
          throw err;
        }
        break;
      }
      
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`💰 PaymentIntent status: ${paymentIntent.status}`);
        break;
      }
      
      case 'charge.succeeded': {
        const charge = event.data.object as Stripe.Charge;
        console.log(`💵 Charge id: ${charge.id}`);
        break;
      }
      
      default: {
        console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
      }
    }

    // Return a response to acknowledge receipt of the event
    return NextResponse.json({ received: true });

  } catch (err) {
    console.error('❌ Error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}