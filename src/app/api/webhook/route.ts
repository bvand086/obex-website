import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { headers } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { EmailType } from '@/lib/emails';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});
const resend = new Resend(process.env.RESEND_API_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// New App Router config syntax
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const preferredRegion = 'auto';
export const maxDuration = 60; // Increased timeout to ensure webhook has enough time to process

// Configure the HTTP method and content type
export async function POST(req: NextRequest) {
  try {
    // Get the raw request body as text first
    const text = await req.text();
    const rawBody = Buffer.from(text);
    
    // Get the Stripe signature from headers
    const sig = headers().get('Stripe-Signature');

    if (!sig) {
      console.error('❌ No Stripe signature found in headers');
      console.error('Headers received:', JSON.stringify(Object.fromEntries(headers().entries())));
      return NextResponse.json(
        { error: 'No Stripe signature found' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      // Verify the event with Stripe using the raw body
      console.log('🔑 Webhook secret check:', {
        length: webhookSecret.length,
        prefix: webhookSecret.substring(0, 8),
        suffix: webhookSecret.substring(webhookSecret.length - 4)
      });
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
      console.log('✅ Webhook signature verified:', event.id);
    } catch (err) {
      const error = err as Error;
      console.error('❌ Webhook signature verification failed:', {
        error: error.message,
        signature: sig,
        webhookSecretLength: webhookSecret?.length || 0,
        bodyLength: rawBody.length,
        body: rawBody.toString().slice(0, 100) + '...' // Log first 100 chars for debugging
      });
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${error.message}` },
        { status: 400 }
      );
    }

    // Successfully constructed event
    console.log('✅ Processing webhook event:', {
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

        if (!customerEmail) {
          throw new Error('Customer email not found in session');
        }

        try {
          console.log('💫 Processing order for customer:', customerEmail);

          // Calculate amount (no need for Supabase)
          const amountTotal = session.amount_total != null ? session.amount_total / 100 : 34.99;

          // Extract flavor from custom fields
          let selectedFlavor = 'Not specified';
          if (session.custom_fields && session.custom_fields.length > 0) {
            const flavorField = session.custom_fields.find(field => field.key === 'chooseyourflavour');
            if (flavorField && 
                'dropdown' in flavorField && 
                flavorField.dropdown && 
                typeof flavorField.dropdown === 'object' && 
                flavorField.dropdown.value) {
              // Map the flavor value to a more readable format
              const flavorMap: Record<string, string> = {
                'lemonmeringue': 'Lemon Meringue',
                'orangecream': 'Orange Cream',
                'soothingmint': 'Soothing Mint'
              };
              selectedFlavor = flavorMap[flavorField.dropdown.value] || flavorField.dropdown.value;
            }
          }

          // Determine product name
          const productName = 'ØBEX Reflux Relief';

          // Send customer confirmation email
          await resend.emails.send({
            from: 'ØBEX <support@obexcanada.com>',
            to: [customerEmail],
            subject: 'Welcome to ØBEX - Order Confirmation',
            html: `
              <!DOCTYPE html>
              <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #ffffff;">
                  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    
                    <h1 style="color: #2A9D8F; margin-bottom: 25px;">Thank you for your ØBEX order!</h1>
                    
                    <img src="https://obexcanada.com/OSlashLogo.png" alt="ØBEX Logo" style="width: 150px; margin-bottom: 30px; display: block; margin-left: auto; margin-right: auto;">

                    <p style="font-size: 16px; margin-bottom: 20px;">Dear ${customerName || 'Valued Customer'},</p>
                    
                    <p style="font-size: 16px; margin-bottom: 25px;">We're excited to confirm your order for ${productName}. Your natural solution for reflux relief is on its way!</p>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e9ecef;">
                      <h2 style="color: #2A9D8F; margin-top: 0; margin-bottom: 20px;">Order Details</h2>
                      <p style="margin: 10px 0;"><strong>Order ID:</strong> ${session.id}</p>
                      <p style="margin: 10px 0;"><strong>Product:</strong> ${productName}</p>
                      <p style="margin: 10px 0;"><strong>Flavor:</strong> ${selectedFlavor}</p>
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
                      <p style="margin: 10px 0;"><strong>Product:</strong> ${productName}</p>
                      <p style="margin: 10px 0;"><strong>Flavor:</strong> ${selectedFlavor}</p>
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
          
          // --- START: New Email Scheduling Logic ---
          try {
            const now = new Date();
            const schedule = [
              { type: 'welcome_2_usage', days: 3 },
              { type: 'welcome_3_education', days: 10 },
              { type: 'welcome_4_community', days: 24 },
              { type: 'welcome_5_feedback', days: 38 },
            ];

            const emailsToSchedule = schedule.map(item => {
              const sendAt = new Date(now);
              sendAt.setDate(now.getDate() + item.days);
              return {
                customer_email: customerEmail,
                customer_name: customerName || null,
                email_type: item.type as EmailType,
                send_at: sendAt.toISOString(),
                status: 'pending' as const,
                metadata: {
                  selectedFlavor: selectedFlavor,
                  productName: productName,
                  amountTotal: amountTotal.toFixed(2),
                  currency: 'CAD',
                  shippingAddress: address
                },
                order_id: session.id,
                attempt_count: 0,
              };
            });

            const { error: insertError } = await supabaseAdmin
              .from('scheduled_emails')
              .insert(emailsToSchedule);

            if (insertError) {
              throw insertError;
            }

            console.log(`📅 Scheduled ${emailsToSchedule.length} follow-up emails for ${customerEmail}`);

          } catch (scheduleError) {
            console.error(`❌ Error scheduling follow-up emails for ${customerEmail}:`, scheduleError);
            // We don't throw the main error since the order processing succeeded
          }
          // --- END: New Email Scheduling Logic ---
          
          console.log('✅ Order processed successfully');

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

    // Return a 200 response to acknowledge receipt of the event
    return NextResponse.json({ received: true });

  } catch (err) {
    console.error('❌ Error processing webhook:', err);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}