import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function GET() {
  try {
    // Mock session data
    const mockSession = {
      id: 'test_order_' + new Date().getTime(),
      amount_total: 3499, // $34.99
      customer_details: {
        name: 'Test Customer',
        email: 'obexincorporated@gmail.com', // You'll receive both emails here
        address: {
          line1: '123 Test Street',
          line2: 'Suite 100',
          city: 'Hamilton',
          state: 'Ontario',
          postal_code: 'L8P 1X1',
          country: 'Canada'
        }
      }
    }

    // Send customer confirmation email
    await resend.emails.send({
      from: 'ØBEX <support@obexcanada.com>',
      to: mockSession.customer_details.email,
      subject: 'Welcome to ØBEX - Order Confirmation',
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #ffffff;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <img src="https://obexcanada.com/OSlashLogo.png" alt="ØBEX Logo" style="width: 150px; margin-bottom: 30px;">
              
              <h1 style="color: #2A9D8F; margin-bottom: 25px;">Thank you for your ØBEX order!</h1>
              
              <p style="font-size: 16px; margin-bottom: 20px;">Dear ${mockSession.customer_details.name || 'Valued Customer'},</p>
              
              <p style="font-size: 16px; margin-bottom: 25px;">We're excited to confirm your order for the ØBEX Large Pack. Your natural solution for reflux relief is on its way!</p>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e9ecef;">
                <h2 style="color: #2A9D8F; margin-top: 0; margin-bottom: 20px;">Order Details</h2>
                <p style="margin: 10px 0;"><strong>Order ID:</strong> ${mockSession.id}</p>
                <p style="margin: 10px 0;"><strong>Product:</strong> ØBEX Large Pack (24 packets)</p>
                <p style="margin: 10px 0;"><strong>Amount:</strong> $${(mockSession.amount_total / 100).toFixed(2)} CAD</p>
              </div>
              
              <p style="font-size: 16px; margin-bottom: 15px;">Your order will be shipped to:</p>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #e9ecef;">
                ${mockSession.customer_details.address.line1}<br>
                ${mockSession.customer_details.address.line2}<br>
                ${mockSession.customer_details.address.city}, 
                ${mockSession.customer_details.address.state} 
                ${mockSession.customer_details.address.postal_code}<br>
                ${mockSession.customer_details.address.country}
              </div>
              
              <p style="font-size: 16px; margin-bottom: 20px;">We'll send you another email with tracking information once your order ships.</p>
              
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
      subject: `New ØBEX Order - ${mockSession.id}`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #ffffff;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #2A9D8F; margin-bottom: 25px;">New Order Received</h1>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e9ecef;">
                <h2 style="color: #2A9D8F; margin-top: 0; margin-bottom: 20px;">Order Details</h2>
                <p style="margin: 10px 0;"><strong>Order ID:</strong> ${mockSession.id}</p>
                <p style="margin: 10px 0;"><strong>Product:</strong> ØBEX Large Pack (24 packets)</p>
                <p style="margin: 10px 0;"><strong>Amount:</strong> $${(mockSession.amount_total / 100).toFixed(2)} CAD</p>
                <p style="margin: 10px 0;"><strong>Date:</strong> ${new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' })}</p>
              </div>

              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e9ecef;">
                <h2 style="color: #2A9D8F; margin-top: 0; margin-bottom: 20px;">Customer Information</h2>
                <p style="margin: 10px 0;"><strong>Name:</strong> ${mockSession.customer_details.name || 'Not provided'}</p>
                <p style="margin: 10px 0;"><strong>Email:</strong> ${mockSession.customer_details.email}</p>
              </div>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e9ecef;">
                <h2 style="color: #2A9D8F; margin-top: 0; margin-bottom: 20px;">Shipping Address</h2>
                <p style="margin: 10px 0;">
                  ${mockSession.customer_details.address.line1}<br>
                  ${mockSession.customer_details.address.line2}<br>
                  ${mockSession.customer_details.address.city}, 
                  ${mockSession.customer_details.address.state} 
                  ${mockSession.customer_details.address.postal_code}<br>
                  ${mockSession.customer_details.address.country}
                </p>
              </div>

              <p style="font-size: 16px; color: #666;">This order needs to be processed and shipped. Please update the customer with tracking information once shipped.</p>
            </div>
          </body>
        </html>
      `
    })

    return new Response('Test emails sent successfully! Check obexincorporated@gmail.com for both emails.', { status: 200 })
  } catch (err) {
    console.error('Email test error:', err)
    return new Response(
      'Failed to send test emails: ' + (err as Error).message,
      { status: 500 }
    )
  }
} 