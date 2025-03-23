import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';
import { EmailType } from '@/lib/emails';

const resend = new Resend(process.env.RESEND_API_KEY!);
const MAX_EMAILS_PER_RUN = 50;

// New App Router config syntax
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const preferredRegion = 'auto';
export const maxDuration = 60;

// Email templates for the welcome sequence
const emailTemplates: Record<EmailType, {
  subject: string;
  generateHtml: (customerName: string, metadata: any) => string;
}> = {
  welcome_1: {
    subject: 'Welcome to ØBEX - Order Confirmation',
    generateHtml: (customerName, metadata) => ``, // Already handled in webhook
  },
  welcome_2_usage: {
    subject: 'Getting the Most from Your ØBEX',
    generateHtml: (customerName, metadata) => `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #ffffff;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            
            <h1 style="color: #2A9D8F; margin-bottom: 25px;">How to Use Your ØBEX</h1>
            
            <img src="https://obexcanada.com/OSlashLogo.png" alt="ØBEX Logo" style="width: 150px; margin-bottom: 30px; display: block; margin-left: auto; margin-right: auto;">

            <p style="font-size: 16px; margin-bottom: 20px;">Dear ${customerName || 'Valued Customer'},</p>
            
            <p style="font-size: 16px; margin-bottom: 25px;">We hope you're enjoying your ØBEX! Here are some tips to get the most out of your product:</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e9ecef;">
              <h2 style="color: #2A9D8F; margin-top: 0; margin-bottom: 20px;">Optimal Usage Guidelines</h2>
              
              <p style="margin: 10px 0;"><strong>1. Timing:</strong> Take ØBEX after meals and an hour before bedtime for best results</p>
              <p style="margin: 10px 0;"><strong>2. Dosage:</strong> For most people, a teaspoon (approximately 5ml) is sufficient, but taking more if needed is completely safe</p>
              <p style="margin: 10px 0;"><strong>3. As Needed:</strong> ØBEX is a rescue medication - take it with meals or when you experience symptoms, rather than on a fixed schedule</p>
            </div>
            
            <p style="font-size: 16px; margin-bottom: 20px;">With your ${metadata?.selectedFlavor || 'selected'} flavor, you'll find that ØBEX is an enjoyable part of your daily routine. Most of our customers report noticeable improvement within 7-14 days of consistent use.</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e9ecef;">
              <h2 style="color: #2A9D8F; margin-top: 0; margin-bottom: 20px;">Quick Tip</h2>
              <p style="margin: 10px 0;">For nighttime reflux, try taking ØBEX about an hour before bedtime and elevating the head of your bed 15-20 cm (6-8 inches).</p>
            </div>
            
            <p style="font-size: 16px; margin-bottom: 30px;">If you have any questions about using your ØBEX, please reach out to us at <a href="mailto:support@obexcanada.com" style="color: #2A9D8F; text-decoration: none;">support@obexcanada.com</a></p>
            
            <p style="font-size: 16px;">To your health,<br>The ØBEX Team</p>
          </div>
        </body>
      </html>
    `,
  },
  welcome_3_education: {
    subject: 'Understanding Acid Reflux & Natural Management',
    generateHtml: (customerName, metadata) => `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #ffffff;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            
            <h1 style="color: #2A9D8F; margin-bottom: 25px;">Understanding Acid Reflux</h1>
            
            <img src="https://obexcanada.com/OSlashLogo.png" alt="ØBEX Logo" style="width: 150px; margin-bottom: 30px; display: block; margin-left: auto; margin-right: auto;">

            <p style="font-size: 16px; margin-bottom: 20px;">Dear ${customerName || 'Valued Customer'},</p>
            
            <p style="font-size: 16px; margin-bottom: 25px;">As you continue your journey with ØBEX, we wanted to share some helpful information about acid reflux and how to manage it naturally:</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e9ecef;">
              <h2 style="color: #2A9D8F; margin-top: 0; margin-bottom: 20px;">What Causes Acid Reflux?</h2>
              
              <p style="margin: 10px 0;">Acid reflux occurs when stomach acid flows back into the esophagus, causing that uncomfortable burning sensation. This happens when the lower esophageal sphincter (LES) doesn't close properly.</p>
              
              <p style="margin: 10px 0;">Common triggers include:</p>
              <ul style="margin-top: 5px;">
                <li>Spicy, fatty, or acidic foods</li>
                <li>Large meals</li>
                <li>Eating too close to bedtime</li>
                <li>Stress</li>
                <li>Certain medications</li>
              </ul>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e9ecef;">
              <h2 style="color: #2A9D8F; margin-top: 0; margin-bottom: 20px;">Natural Management Strategies</h2>
              
              <p style="margin: 15px 0;"><strong>1. Dietary Changes:</strong> Consider keeping a food journal to identify your triggers</p>
              <p style="margin: 15px 0;"><strong>2. Meal Timing:</strong> Eat smaller, more frequent meals and avoid eating 2-3 hours before bed</p>
              <p style="margin: 15px 0;"><strong>3. Sleep Position:</strong> Elevate the head of your bed by 15-20 cm (6-8 inches)</p>
              <p style="margin: 15px 0;"><strong>4. Stress Management:</strong> Practice relaxation techniques like deep breathing or meditation</p>
              <p style="margin: 15px 0;"><strong>5. Natural Supplements:</strong> Your ØBEX contains carefully selected ingredients that support digestive health</p>
            </div>
            
            <p style="font-size: 16px; margin-bottom: 30px;">Combining these strategies with your regular use of ØBEX can help provide some relief. As always, if you have any questions, please contact us at <a href="mailto:support@obexcanada.com" style="color: #2A9D8F; text-decoration: none;">support@obexcanada.com</a></p>
            
            <p style="font-size: 16px;">To your health,<br>The ØBEX Team</p>
          </div>
        </body>
      </html>
    `,
  },
  welcome_4_community: {
    subject: 'Join the ØBEX Community!',
    generateHtml: (customerName, metadata) => `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #ffffff;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            
            <h1 style="color: #2A9D8F; margin-bottom: 25px;">Join Our Community!</h1>
            
            <img src="https://obexcanada.com/OSlashLogo.png" alt="ØBEX Logo" style="width: 150px; margin-bottom: 30px; display: block; margin-left: auto; margin-right: auto;">

            <p style="font-size: 16px; margin-bottom: 20px;">Dear ${customerName || 'Valued Customer'},</p>
            
            <p style="font-size: 16px; margin-bottom: 25px;">We hope your ØBEX Reflux Relief is helping you enjoy your days with more comfort! We've created spaces where our community of users share their experiences, tips, and success stories, and we'd love for you to join us.</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e9ecef;">
              <h2 style="color: #2A9D8F; margin-top: 0; margin-bottom: 20px;">Connect With Us</h2>
              
              <p style="margin: 15px 0;"><strong>Instagram:</strong> <a href="https://www.instagram.com/obexcanada" style="color: #2A9D8F; text-decoration: none;">@obexcanada</a> - Follow us for wellness tips, customer stories, and new product announcements</p>
              
              <p style="margin: 15px 0;"><strong>Facebook:</strong> <a href="https://www.facebook.com/OBEXCanada" style="color: #2A9D8F; text-decoration: none;">ØBEX Canada</a> - Join our community group to connect with other ØBEX users</p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e9ecef;">
              <h2 style="color: #2A9D8F; margin-top: 0; margin-bottom: 20px;">Share Your Story</h2>
              
              <p style="margin: 10px 0;">Has ØBEX made a difference in your life? We'd love to hear about it! Share your experience on social media with the hashtag <strong>#MyOBEXJourney</strong> or email us directly at <a href="mailto:support@obexcanada.com" style="color: #2A9D8F; text-decoration: none;">support@obexcanada.com</a></p>
            </div>
            
            <p style="font-size: 16px; margin-bottom: 30px;">Being part of the ØBEX community means you're never alone on your wellness journey. We're here to support you every step of the way!</p>
            
            <p style="font-size: 16px;">To your health,<br>The ØBEX Team</p>
          </div>
        </body>
      </html>
    `,
  },
  welcome_5_feedback: {
    subject: 'How is ØBEX working for you?',
    generateHtml: (customerName, metadata) => `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #ffffff;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            
            <h1 style="color: #2A9D8F; margin-bottom: 25px;">We'd Love Your Feedback!</h1>
            
            <img src="https://obexcanada.com/OSlashLogo.png" alt="ØBEX Logo" style="width: 150px; margin-bottom: 30px; display: block; margin-left: auto; margin-right: auto;">

            <p style="font-size: 16px; margin-bottom: 20px;">Dear ${customerName || 'Valued Customer'},</p>
            
            <p style="font-size: 16px; margin-bottom: 25px;">It's been over a month since you started your journey with ØBEX, and we're eager to hear about your experience! Your feedback is invaluable as we continue to improve our products and help more people find natural relief from acid reflux.</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e9ecef;">
              <h2 style="color: #2A9D8F; margin-top: 0; margin-bottom: 20px;">Share Your Feedback</h2>
              
              <p style="margin: 15px 0;">Please take a moment to answer these quick questions:</p>
              
              <p style="margin: 15px 0;">1. On a scale of 1-10, how would you rate your experience with ØBEX?</p>
              <p style="margin: 15px 0;">2. Have you noticed an improvement in your reflux symptoms?</p>
              <p style="margin: 15px 0;">3. Would you recommend ØBEX to a friend or family member?</p>
              <p style="margin: 15px 0;">4. Is there anything we could improve about the product?</p>
              
              <p style="margin: 20px 0; text-align: center;">
                <a href="https://forms.gle/JfPd4xk8RKu6Z4rY9" style="background-color: #2A9D8F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Submit Your Feedback</a>
              </p>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #e9ecef;">
              <h2 style="color: #2A9D8F; margin-top: 0; margin-bottom: 20px;">Leave a Review</h2>
              
              <p style="margin: 10px 0;">If ØBEX has helped you, would you consider leaving a review? Your review helps others discover natural relief from acid reflux.</p>
              
              <p style="margin: 20px 0; text-align: center;">
                Visit our website at <a href="https://obexcanada.com" style="color: #2A9D8F; text-decoration: underline;">obexcanada.com</a> to leave a review or email us at <a href="mailto:support@obexcanada.com" style="color: #2A9D8F; text-decoration: underline;">support@obexcanada.com</a>
              </p>
            </div>
            
            <p style="font-size: 16px; margin-bottom: 30px;">Thank you for choosing ØBEX for your digestive health. We appreciate your support and feedback!</p>
            
            <p style="font-size: 16px;">To your continued digestive wellness,<br>The ØBEX Team</p>
            
          </div>
        </body>
      </html>
    `,
  }
};

/**
 * API route to process scheduled emails
 * Should be called by a cron job every 15 minutes
 */
export async function GET(req: NextRequest) {
  try {
    // Check for API key authorization
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== process.env.CRON_SECRET) {
      console.error('❌ Unauthorized access attempt to process-emails endpoint');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔄 Processing scheduled emails...');
    
    // Get current date/time
    const now = new Date();
    
    // Query for pending emails that are due to be sent
    const { data: emails, error } = await supabase
      .from('scheduled_emails')
      .select('*')
      .eq('status', 'pending')
      .lte('send_at', now.toISOString())
      .order('send_at', { ascending: true })
      .limit(MAX_EMAILS_PER_RUN);
    
    if (error) {
      console.error('❌ Error querying scheduled emails:', error);
      return NextResponse.json(
        { error: 'Database error', message: error.message },
        { status: 500 }
      );
    }
    
    if (!emails || emails.length === 0) {
      console.log('✅ No emails to process at this time');
      return NextResponse.json({ processed: 0 });
    }
    
    console.log(`📨 Found ${emails.length} emails to process`);
    
    let successCount = 0;
    let failureCount = 0;
    
    // Process each email
    for (const email of emails) {
      try {
        // Skip if email type is not in templates
        if (!(email.email_type in emailTemplates)) {
          console.warn(`⚠️ Unknown email type: ${email.email_type}`);
          
          // Update status to failed
          await supabase
            .from('scheduled_emails')
            .update({
              status: 'failed',
              attempt_count: email.attempt_count + 1
            })
            .eq('id', email.id);
            
          failureCount++;
          continue;
        }
        
        const template = emailTemplates[email.email_type as EmailType];
        const metadata = email.metadata || {};
        
        // Send the email using Resend
        await resend.emails.send({
          from: 'ØBEX <support@obexcanada.com>',
          to: [email.customer_email],
          subject: template.subject,
          html: template.generateHtml(email.customer_name || 'Valued Customer', metadata)
        });
        
        // Update email status to sent
        await supabase
          .from('scheduled_emails')
          .update({
            status: 'sent',
            attempt_count: email.attempt_count + 1
          })
          .eq('id', email.id);
        
        console.log(`✅ Sent ${email.email_type} email to ${email.customer_email}`);
        successCount++;
        
      } catch (err) {
        console.error(`❌ Error sending email ${email.id}:`, err);
        
        // Update attempt count and status if max attempts reached
        const newAttemptCount = email.attempt_count + 1;
        const status = newAttemptCount >= 3 ? 'failed' : 'pending';
        
        await supabase
          .from('scheduled_emails')
          .update({
            status,
            attempt_count: newAttemptCount
          })
          .eq('id', email.id);
          
        failureCount++;
      }
    }
    
    console.log(`📊 Email processing complete: ${successCount} succeeded, ${failureCount} failed`);
    
    return NextResponse.json({
      processed: emails.length,
      succeeded: successCount,
      failed: failureCount
    });
    
  } catch (err) {
    const error = err as Error;
    console.error('❌ Error processing scheduled emails:', error.message);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
} 