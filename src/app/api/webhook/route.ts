import { headers } from 'next/headers'
import Stripe from 'stripe'
import { Resend } from 'resend'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const resend = new Resend(process.env.RESEND_API_KEY!)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get('stripe-signature')!

  try {
    const event = stripe.webhooks.constructEvent(
      body, 
      sig, 
      endpointSecret
    )

    // Handle successful checkouts
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      
      // Extract customer details
      const customerEmail = session.customer_details?.email
      const customerName = session.customer_details?.name
      
      // Get product details
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
      
      if (customerEmail) {
        // Store customer data in Supabase
        const { data: customer, error: customerError } = await supabase
          .from('customers')
          .upsert({
            stripe_customer_id: session.customer,
            email: customerEmail,
            name: customerName
          })
          .select()
          .single()

        if (customerError) {
          console.error('Error storing customer:', customerError)
          throw customerError
        }

        // Store address data
        const { data: address, error: addressError } = await supabase
          .from('addresses')
          .insert({
            customer_id: customer.id,
            line1: session.customer_details?.address?.line1,
            line2: session.customer_details?.address?.line2,
            city: session.customer_details?.address?.city,
            state: session.customer_details?.address?.state,
            postal_code: session.customer_details?.address?.postal_code,
            country: session.customer_details?.address?.country
          })
          .select()
          .single()

        if (addressError) {
          console.error('Error storing address:', addressError)
          throw addressError
        }

        // Store order data
        const { error: orderError } = await supabase
          .from('orders')
          .insert({
            stripe_order_id: session.id,
            customer_id: customer.id,
            address_id: address.id,
            amount_total: session.amount_total ? session.amount_total / 100 : null,
            status: 'pending'
          })

        if (orderError) {
          console.error('Error storing order:', orderError)
          throw orderError
        }

        // Send welcome email to customer
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
                    ${session.customer_details?.address?.line1 || ''}<br>
                    ${session.customer_details?.address?.line2 ? session.customer_details.address.line2 + '<br>' : ''}
                    ${session.customer_details?.address?.city || ''}, 
                    ${session.customer_details?.address?.state || ''} 
                    ${session.customer_details?.address?.postal_code || ''}<br>
                    ${session.customer_details?.address?.country || ''}
                  </div>
                                    
                  <p style="font-size: 16px; margin-bottom: 30px;">If you have any questions about your order, please don't hesitate to contact us at <a href="mailto:support@obexcanada.com" style="color: #2A9D8F; text-decoration: none;">support@obexcanada.com</a></p>
                  
                  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e9ecef;">
                    <p style="color: #6c757d; font-size: 14px; margin: 0;">
                      ØBEX Corporation<br>
                      Hamilton, Ontario, Canada<br>
                      <a href="https://obexcanada.com" style="color: #2A9D8F; text-decoration: none;">obexcanada.com</a>
                    </p>
                  </div>
                </div>
              </body>
            </html>
          `
        })

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
                      ${session.customer_details?.address?.line1 || ''}<br>
                      ${session.customer_details?.address?.line2 ? session.customer_details.address.line2 + '<br>' : ''}
                      ${session.customer_details?.address?.city || ''}, 
                      ${session.customer_details?.address?.state || ''} 
                      ${session.customer_details?.address?.postal_code || ''}<br>
                      ${session.customer_details?.address?.country || ''}
                    </p>
                  </div>

                  <p style="font-size: 16px; color: #666;">This order needs to be processed and shipped. Please update the customer with tracking information once shipped.</p>
                </div>
              </body>
            </html>
          `
        })

        // Log order for shipping
        console.log('New order to be shipped:', {
          orderId: session.id,
          customer: customerName,
          email: customerEmail,
          address: session.customer_details?.address
        })
      }
    }

    return new Response('Success', { status: 200 })
  } catch (err) {
    console.error('Webhook error:', err)
    return new Response(
      'Webhook error: ' + (err as Error).message,
      { status: 400 }
    )
  }
} 