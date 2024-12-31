import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';
import { headers } from 'next/headers';

// Initialize Stripe with apiVersion
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY!);

// Get webhook secret from environment
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Route segment config
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  // Get raw body as buffer and convert to string
  const bodyBuffer = await req.arrayBuffer();
  const rawBody = Buffer.from(bodyBuffer).toString('utf8');
  
  try {
    const headersList = headers();
    const signature = headersList.get('stripe-signature');

    console.log('Processing webhook...');
    console.log('Raw body length:', rawBody.length);
    console.log('Headers:', Object.fromEntries(headersList.entries()));

    if (!signature) {
      console.error('No Stripe signature header found');
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      // Verify the signature with raw body
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      );
      console.log('Webhook event verified:', event.type);
    } catch (err) {
      console.error('⚠️ Webhook signature verification failed:', err);
      console.error('Raw body first 100 chars:', rawBody.substring(0, 100));
      console.error('Signature:', signature);
      console.error('Secret first/last 4 chars:', 
        webhookSecret.substring(0, 4) + '...' + webhookSecret.substring(webhookSecret.length - 4));
      return NextResponse.json(
        { error: `Webhook Error: ${(err as Error).message}` },
        { status: 400 }
      );
    }

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

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
        console.log('Processing order for customer:', customerEmail);

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

        console.log('Customer stored:', customer);

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

        console.log('Address stored:', addressData);

        // Store order in Supabase
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .insert({
            stripe_order_id: session.id,
            customer_id: customer.id,
            address_id: addressData.id,
            amount_total: session.amount_total ? session.amount_total / 100 : null,
            status: 'pending',
          })
          .select()
          .single();

        if (orderError) throw orderError;

        console.log('Order stored:', orderData);

        // Send customer confirmation email
        await resend.emails.send({
          from: 'ØBEX <support@obexcanada.com>',
          to: customerEmail,
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
                    <p style="margin: 10px 0;"><strong>Amount:</strong> $${(session.amount_total ? session.amount_total / 100 : 34.99).toFixed(2)} CAD</p>
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

        console.log('Customer confirmation email sent');

        // Send internal notification email
        await resend.emails.send({
          from: 'ØBEX Orders <support@obexcanada.com>',
          to: 'obexincorporated@gmail.com',
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
                    <p style="margin: 10px 0;"><strong>Amount:</strong> $${(session.amount_total ? session.amount_total / 100 : 34.99).toFixed(2)} CAD</p>
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

        console.log('Internal notification email sent');
        console.log('Order processed successfully:', orderData);

      } catch (err) {
        console.error('Error handling order:', err);
        throw err;
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}