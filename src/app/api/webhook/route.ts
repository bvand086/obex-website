import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';
import { headers } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { EmailType } from '@/lib/emails';
import { Buffer } from 'buffer';

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

        // Validate shipping address is Canadian
        if (address && address.country && address.country !== 'CA') {
          console.error('⚠️ Non-Canadian shipping address detected:', {
            sessionId: session.id,
            country: address.country,
            customerEmail: customerEmail
          });

          // Send notification to customer about shipping restriction
          try {
            await resend.emails.send({
              from: 'ØBEX <support@obexcanada.com>',
              to: [customerEmail],
              subject: 'Order Processing Issue - Shipping Restriction',
              html: `
                <!DOCTYPE html>
                <html>
                  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #ffffff;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                      
                      <h1 style="color: #2A9D8F; margin-bottom: 25px;">Important: Shipping Restriction Notice</h1>
                      
                      <img src="https://obexcanada.com/OSlashLogo.png" alt="ØBEX Logo" style="width: 150px; margin-bottom: 30px; display: block; margin-left: auto; margin-right: auto;">

                      <p style="font-size: 16px; margin-bottom: 20px;">Dear ${customerName || 'Valued Customer'},</p>
                      
                      <p style="font-size: 16px; margin-bottom: 25px;">Thank you for your interest in ØBEX Reflux Relief. We noticed that your shipping address is outside of Canada.</p>
                      
                      <div style="background-color: #fff3e0; border: 2px solid #ff9800; padding: 20px; border-radius: 8px; margin: 25px 0;">
                        <p style="margin: 0; font-weight: bold; color: #ef6c00;">Currently, ØBEX products are only available for delivery within Canada.</p>
                      </div>
                      
                      <p style="font-size: 16px; margin-bottom: 20px;">We apologize for any inconvenience this may cause. Your order will be reviewed by our team, and if it cannot be fulfilled, you will receive a full refund within 5-7 business days.</p>
                      
                      <p style="font-size: 16px; margin-bottom: 20px;">If you have a Canadian shipping address you'd like to use instead, or if you have any questions, please contact us immediately at:</p>
                      
                      <p style="font-size: 16px; margin-bottom: 30px;">
                        Email: <a href="mailto:support@obexcanada.com" style="color: #2A9D8F; text-decoration: none;">support@obexcanada.com</a><br>
                        Please reference Order ID: ${session.id}
                      </p>
                      
                      <p style="font-size: 16px; margin-bottom: 20px;">We're actively working on expanding our shipping capabilities and hope to serve international customers in the future.</p>
                      
                      <p style="font-size: 16px;">Thank you for your understanding.</p>
                      
                      <p style="font-size: 16px; margin-top: 40px;">Best regards,<br>The ØBEX Team</p>
                    </div>
                  </body>
                </html>
              `
            });
          } catch (emailError) {
            console.error('Failed to send customer notification about shipping restriction:', emailError);
          }

          // Send alert to admin
          try {
            await resend.emails.send({
              from: 'ØBEX Orders <support@obexcanada.com>',
              to: ['obexincorporated@gmail.com'],
              subject: `🚨 URGENT: Non-Canadian Order Attempted - Manual Review Required`,
              html: `
                <!DOCTYPE html>
                <html>
                  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #ffffff;">
                    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                      <h1 style="color: #d32f2f; margin-bottom: 25px;">⚠️ Non-Canadian Shipping Address Detected</h1>
                      
                      <div style="background-color: #ffebee; border: 3px solid #f44336; padding: 20px; border-radius: 8px; margin: 25px 0;">
                        <h2 style="color: #d32f2f; margin-top: 0;">Immediate Action Required</h2>
                        <p style="margin: 10px 0;"><strong>Order ID:</strong> ${session.id}</p>
                        <p style="margin: 10px 0;"><strong>Customer Email:</strong> ${customerEmail}</p>
                        <p style="margin: 10px 0;"><strong>Customer Name:</strong> ${customerName || 'Not provided'}</p>
                        <p style="margin: 10px 0;"><strong>Country:</strong> ${address.country}</p>
                        <p style="margin: 10px 0;"><strong>Full Address:</strong><br>
                          ${address.line1}<br>
                          ${address.line2 ? address.line2 + '<br>' : ''}
                          ${address.city}, ${address.state} ${address.postal_code}<br>
                          ${address.country}
                        </p>
                      </div>
                      
                      <div style="background-color: #e3f2fd; border: 1px solid #2196f3; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3 style="color: #1976d2; margin-top: 0;">Required Actions:</h3>
                        <ol style="margin: 10px 0; padding-left: 20px;">
                          <li>Review this order in the Stripe Dashboard</li>
                          <li>Contact the customer if they have a Canadian address available</li>
                          <li>If order cannot be fulfilled, process a refund</li>
                          <li>Update the customer on the order status</li>
                        </ol>
                      </div>
                      
                      <p style="font-size: 16px; color: #666;">The customer has been notified about the shipping restriction. The order will continue to be processed but requires manual intervention.</p>
                    </div>
                  </body>
                </html>
              `
            });
          } catch (emailError) {
            console.error('Failed to send admin alert about shipping restriction:', emailError);
          }

          // Continue processing the order but flag it in the logs
          // This allows for manual review rather than automatic cancellation
          console.warn('🚨 Processing order with non-Canadian address for manual review');
        }

        try {
          console.log('💫 Processing order for customer:', customerEmail);

          // Calculate amount (no need for Supabase)
          const amountTotal = session.amount_total != null ? session.amount_total / 100 : 34.99;
          
          // Get shipping option information
          const shippingRate = session.shipping_cost?.shipping_rate;
          let shippingMethod = 'Standard Shipping';
          let shippingCost = 0;
          
          if (shippingRate && typeof shippingRate === 'string') {
            // Try to get the shipping rate details from Stripe if available
            try {
              const shippingRateDetails = await stripe.shippingRates.retrieve(shippingRate);
              shippingMethod = shippingRateDetails.display_name || 'Standard Shipping';
              shippingCost = shippingRateDetails.fixed_amount?.amount ? 
                shippingRateDetails.fixed_amount.amount / 100 : 0;
            } catch (error) {
              console.error('Error retrieving shipping rate details:', error);
              // Fall back to just using the shipping cost from the session
              shippingCost = session.shipping_cost?.amount_total ? 
                session.shipping_cost.amount_total / 100 : 0;
            }
          } else if (session.shipping_cost?.amount_total) {
            // If we don't have a shipping rate ID, just use the cost
            shippingCost = session.shipping_cost.amount_total / 100;
          }

          // Get cart items from metadata if available
          let cartItems: {
            flavor?: string, 
            qty?: number, 
            flavor_breakdown?: string,
            ship_flavors?: string,
            order_summary?: string,
            flavor_details?: Record<string, number>
          }[] = [];
          let productDetailsHtml = '';
          
          if (session.metadata?.cart_details) {
            try {
              cartItems = JSON.parse(session.metadata.cart_details);
              console.log('🛒 Cart details parsed:', JSON.stringify(cartItems, null, 2));
              
              // Generate HTML for multiple items with detailed flavor information
              if (cartItems.length > 0) {
                productDetailsHtml = cartItems.map(item => {
                  // Use the most detailed flavor information available
                  const flavorInfo = item.ship_flavors || item.flavor_breakdown || item.flavor || 'Not specified';
                  
                  return `
                    <div style="margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
                      <p style="margin: 5px 0;"><strong>${item.qty || 1}x ØBEX Reflux Relief</strong></p>
                      <p style="margin: 5px 0; color: #e63946; font-weight: bold;">SHIP THESE FLAVORS: ${flavorInfo}</p>
                    </div>
                  `;
                }).join('');
              }
            } catch (error) {
              console.error('Error parsing cart details:', error);
              console.error('Raw cart_details:', session.metadata.cart_details);
            }
          }

          // If we have the shipping_guide in metadata, add it prominently
          if (session.metadata?.SHIPPING_GUIDE) {
            productDetailsHtml = `
              <div style="background-color: #fde2e2; border: 2px solid #e63946; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <h3 style="color: #e63946; margin-top: 0;">IMPORTANT - SHIPPING INSTRUCTIONS</h3>
                <p style="font-weight: bold; color: #333;">${session.metadata.SHIPPING_GUIDE}</p>
              </div>
            ` + productDetailsHtml;
          }
          
          // Look for flavor information in line items if cart details don't have flavor info
          if (!productDetailsHtml.includes('SHIP THESE FLAVORS') && session.line_items) {
            try {
              const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
              
              if (lineItems.data && lineItems.data.length > 0) {
                const itemsHtml = lineItems.data.map(item => {
                  // Extract flavor info from the description or name
                  const description = item.description || '';
                  const name = item.description || '';
                  
                  let flavorInfo = 'Not specified';
                  if (description.includes('FLAVORS TO SHIP:')) {
                    flavorInfo = description.split('FLAVORS TO SHIP:')[1].trim();
                  } else if (name.includes('SHIP:')) {
                    flavorInfo = name.split('SHIP:')[1].trim();
                  }
                  
                  return `
                    <div style="margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
                      <p style="margin: 5px 0;"><strong>${item.quantity}x ${item.description || 'ØBEX Reflux Relief'}</strong></p>
                      <p style="margin: 5px 0; color: #e63946; font-weight: bold;">SHIP THESE FLAVORS: ${flavorInfo}</p>
                    </div>
                  `;
                }).join('');
                
                // If we got flavors from line items, use that
                if (itemsHtml.includes('SHIP THESE FLAVORS')) {
                  productDetailsHtml = itemsHtml;
                }
              }
            } catch (error) {
              console.error('Error retrieving line items:', error);
            }
          }
          
          // If no cart details found with flavor info, fall back to the default approach
          if (productDetailsHtml === '') {
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
            
            productDetailsHtml = `
              <div style="margin-bottom: 15px;">
                <p style="margin: 5px 0;"><strong>Product:</strong> ØBEX Reflux Relief</p>
                <p style="margin: 5px 0;"><strong>Flavor:</strong> ${selectedFlavor}</p>
              </div>
            `;
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
                    
                    <p style="font-size: 16px; margin-bottom: 25px;">We're excited to confirm your order for ØBEX Reflux Relief. Your natural solution for reflux relief is on its way!</p>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e9ecef;">
                      <h2 style="color: #2A9D8F; margin-top: 0; margin-bottom: 20px;">Order Details</h2>
                      <p style="margin: 10px 0;"><strong>Order ID:</strong> ${session.id}</p>
                      ${productDetailsHtml}
                      <p style="margin: 10px 0;"><strong>Shipping Method:</strong> ${shippingMethod}</p>
                      <p style="margin: 10px 0;"><strong>Shipping Cost:</strong> $${shippingCost.toFixed(2)} CAD</p>
                      <p style="margin: 10px 0;"><strong>Total Amount:</strong> $${amountTotal.toFixed(2)} CAD</p>
                    </div>
                    
                    <p style="font-size: 16px; margin-bottom: 15px;">Your order will be shipped to:</p>
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e9ecef;">
                      <p style="margin: 0;">
                        ${address?.line1 || ''}<br>
                        ${address?.line2 ? address.line2 + '<br>' : ''}
                        ${address?.city || ''}, 
                        ${address?.state || ''} 
                        ${address?.postal_code || ''}<br>
                        ${address?.country || ''}
                      </p>
                    </div>
                    
                    <p style="font-size: 16px; margin-bottom: 30px;">If you have any questions about your order, please don't hesitate to contact us at <a href="mailto:support@obexcanada.com" style="color: #2A9D8F; text-decoration: none;">support@obexcanada.com</a></p>
                  </div>
                </body>
              </html>
            `
          });

          console.log('📧 Customer confirmation email sent');

          // Extract flavor information using bulletproof function
          const flavorInfo = extractFlavorInformation(session, cartItems);
          
          // Create prominent flavor display for internal email
          const flavorDisplayHtml = `
            <div style="background-color: ${flavorInfo.source === 'none' ? '#ffebee' : '#e8f5e9'}; 
                        border: 3px solid ${flavorInfo.source === 'none' ? '#f44336' : '#4caf50'}; 
                        padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h2 style="color: ${flavorInfo.source === 'none' ? '#d32f2f' : '#2e7d32'}; 
                         margin-top: 0; font-size: 20px; text-transform: uppercase;">
                🍃 FLAVORS TO SHIP 🍃
              </h2>
              <p style="font-size: 18px; font-weight: bold; margin: 10px 0; color: #333;">
                ${flavorInfo.displayText}
              </p>
              <p style="font-size: 14px; color: #666; margin: 5px 0;">
                Source: ${flavorInfo.source} | Session: ${session.id}
              </p>
              ${flavorInfo.source === 'none' ? 
                '<p style="color: #d32f2f; font-weight: bold;">⚠️ MANUAL REVIEW REQUIRED - Check Stripe dashboard for flavor details</p>' : 
                ''
              }
            </div>
          `;

          // Send internal notification email with prominent flavor information
          await resend.emails.send({
            from: 'ØBEX Orders <support@obexcanada.com>',
            to: ['obexincorporated@gmail.com'],
            subject: `🚨 NEW ØBEX ORDER - ${flavorInfo.displayText}`,
            html: `
              <!DOCTYPE html>
              <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #ffffff;">
                  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #2A9D8F; margin-bottom: 25px;">🛒 New Order Received - URGENT PROCESSING REQUIRED</h1>
                    
                    ${flavorDisplayHtml}
                    
                    ${session.metadata?.SHIPPING_GUIDE ? `
                      <div style="background-color: #fff3e0; border: 2px solid #ff9800; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                        <h3 style="color: #ef6c00; margin-top: 0; margin-bottom: 10px;">📋 ADDITIONAL SHIPPING NOTES</h3>
                        <p style="font-weight: bold; font-size: 16px;">${session.metadata.SHIPPING_GUIDE}</p>
                      </div>
                    ` : ''}
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e9ecef;">
                      <h2 style="color: #2A9D8F; margin-top: 0; margin-bottom: 20px;">📦 Order Details</h2>
                      <p style="margin: 10px 0;"><strong>Order ID:</strong> ${session.id}</p>
                      ${productDetailsHtml}
                      <p style="margin: 10px 0;"><strong>Shipping Method:</strong> ${shippingMethod}</p>
                      <p style="margin: 10px 0;"><strong>Shipping Cost:</strong> $${shippingCost.toFixed(2)} CAD</p>
                      <p style="margin: 10px 0;"><strong>Total Amount:</strong> $${amountTotal.toFixed(2)} CAD</p>
                      <p style="margin: 10px 0;"><strong>Order Date:</strong> ${new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' })}</p>
                    </div>

                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e9ecef;">
                      <h2 style="color: #2A9D8F; margin-top: 0; margin-bottom: 20px;">👤 Customer Information</h2>
                      <p style="margin: 10px 0;"><strong>Name:</strong> ${customerName || 'Not provided'}</p>
                      <p style="margin: 10px 0;"><strong>Email:</strong> ${customerEmail}</p>
                    </div>
                    
                    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e9ecef;">
                      <h2 style="color: #2A9D8F; margin-top: 0; margin-bottom: 20px;">🚚 Shipping Address</h2>
                      <p style="margin: 10px 0;">
                        ${address?.line1 || ''}<br>
                        ${address?.line2 ? address.line2 + '<br>' : ''}
                        ${address?.city || ''}, 
                        ${address?.state || ''} 
                        ${address?.postal_code || ''}<br>
                        ${address?.country || ''}
                      </p>
                    </div>

                    <div style="background-color: #e3f2fd; border: 1px solid #2196f3; padding: 15px; border-radius: 5px; margin: 20px 0;">
                      <p style="margin: 0; font-weight: bold; color: #1976d2;">
                        🔍 Debug Info: Flavor extracted from ${flavorInfo.source}
                      </p>
                    </div>

                    <p style="font-size: 16px; color: #666;">Process this order and update customer with tracking information once shipped.</p>
                  </div>
                </body>
              </html>
            `
          });

          console.log('📧 Internal notification email sent');
          
          // Updated email scheduling with new timing and order
          try {
            const now = new Date();
            const schedule = [
              { type: 'welcome_2_usage', days: 3 },
              { type: 'welcome_3_education', days: 10 },
              { type: 'welcome_5_feedback', days: 21 },      // Moved feedback to 3rd position, day 21
              { type: 'welcome_4_community', days: 35 },     // Moved community to 4th position, day 35
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
                  cartItems: cartItems,
                  productName: productName,
                  shippingMethod: shippingMethod,
                  shippingCost: shippingCost.toFixed(2),
                  amountTotal: amountTotal.toFixed(2),
                  currency: 'CAD',
                  shippingAddress: address,
                  flavorInfo: flavorInfo.displayText,
                  flavorSummary: flavorInfo.displayText
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

/**
 * Extract flavor information with multiple fallback strategies
 * This is critical for internal processing - we MUST capture flavor info
 */
function extractFlavorInformation(session: Stripe.Checkout.Session, cartItems: any[] = []) {
  let flavorInfo = {
    displayText: 'FLAVOR INFORMATION NOT FOUND - PLEASE CHECK ORDER MANUALLY',
    rawData: {} as any,
    source: 'none'
  };

  // Strategy 1: Check session metadata for shipping flavors (highest priority)
  if (session.metadata?.shipping_flavors) {
    flavorInfo = {
      displayText: session.metadata.shipping_flavors,
      rawData: { shipping_flavors: session.metadata.shipping_flavors },
      source: 'metadata_shipping_flavors'
    };
    return flavorInfo;
  }

  // Strategy 2: Check session metadata for SHIPPING_GUIDE
  if (session.metadata?.SHIPPING_GUIDE) {
    flavorInfo = {
      displayText: session.metadata.SHIPPING_GUIDE,
      rawData: { SHIPPING_GUIDE: session.metadata.SHIPPING_GUIDE },
      source: 'metadata_shipping_guide'
    };
    return flavorInfo;
  }

  // Strategy 3: Check cart details for detailed flavor information
  if (cartItems && cartItems.length > 0) {
    for (const item of cartItems) {
      if (item.ship_flavors) {
        flavorInfo = {
          displayText: item.ship_flavors,
          rawData: { cart_ship_flavors: item.ship_flavors, full_item: item },
          source: 'cart_ship_flavors'
        };
        return flavorInfo;
      }
      if (item.flavor_breakdown) {
        flavorInfo = {
          displayText: item.flavor_breakdown,
          rawData: { cart_flavor_breakdown: item.flavor_breakdown, full_item: item },
          source: 'cart_flavor_breakdown'
        };
        return flavorInfo;
      }
      if (item.flavor) {
        flavorInfo = {
          displayText: item.flavor,
          rawData: { cart_flavor: item.flavor, full_item: item },
          source: 'cart_flavor'
        };
        return flavorInfo;
      }
    }
  }

  // Strategy 4: Check custom fields
  if (session.custom_fields && session.custom_fields.length > 0) {
    const flavorField = session.custom_fields.find(field => field.key === 'chooseyourflavour');
    if (flavorField && 
        'dropdown' in flavorField && 
        flavorField.dropdown && 
        typeof flavorField.dropdown === 'object' && 
        flavorField.dropdown.value) {
      const flavorMap: Record<string, string> = {
        'lemonmeringue': 'Lemon Meringue',
        'orangecream': 'Orange Cream',
        'soothingmint': 'Soothing Mint'
      };
      const displayFlavor = flavorMap[flavorField.dropdown.value] || flavorField.dropdown.value;
      flavorInfo = {
        displayText: displayFlavor,
        rawData: { custom_field: flavorField },
        source: 'custom_fields'
      };
      return flavorInfo;
    }
  }

  // Log the failure for debugging
  console.error('🚨 CRITICAL: Failed to extract flavor information from order:', {
    sessionId: session.id,
    metadata: session.metadata,
    cartItemsCount: cartItems?.length || 0,
    customFieldsCount: session.custom_fields?.length || 0
  });

  return flavorInfo;
}