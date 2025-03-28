import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { EmailType } from '@/lib/emails';

// Import email generation functions
import {
  generateWelcome2Email,
  generateWelcome3Email,
  generateWelcome4Email,
  generateWelcome5Email
} from '@/lib/emailTemplates';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY!);

const MAX_EMAILS_PER_RUN = 50; // Limit how many emails to process each time
const MAX_SEND_ATTEMPTS = 3;

export async function GET(request: Request) {
  // 1. Authenticate Cron Job Request
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.warn('Unauthorized cron job access attempt');
    return new Response('Unauthorized', { status: 401 });
  }

  console.log('Cron job started: Processing scheduled emails...');

  try {
    // 2. Fetch Pending Emails from Supabase
    const now = new Date().toISOString();
    const { data: emails, error: fetchError } = await supabaseAdmin
      .from('scheduled_emails')
      .select('*')
      .eq('status', 'pending')
      .lte('send_at', now)
      .lt('attempt_count', MAX_SEND_ATTEMPTS) // Only fetch emails that haven't reached max attempts
      .order('send_at', { ascending: true })
      .limit(MAX_EMAILS_PER_RUN);

    if (fetchError) {
      console.error('Error fetching pending emails:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 });
    }

    if (!emails || emails.length === 0) {
      console.log('No pending emails to process.');
      return NextResponse.json({ message: 'No pending emails' });
    }

    console.log(`Found ${emails.length} emails to process.`);
    let emailsSent = 0;
    let emailsFailed = 0;

    // 3. Process Each Email
    for (const email of emails) {
      const emailType = email.email_type as EmailType;
      const customerName = email.customer_name || 'Valued Customer';
      const metadata = email.metadata as Record<string, any> || {}; 

      let subject = '';
      let htmlContent = '';

      try {
        // Determine email content based on type
        switch (emailType) {
          case 'welcome_2_usage':
            subject = 'Getting the Most from Your ØBEX';
            htmlContent = generateWelcome2Email(customerName, metadata);
            break;
          case 'welcome_3_education':
            subject = 'Understanding Acid Reflux & Natural Management';
            htmlContent = generateWelcome3Email(customerName, metadata);
            break;
          case 'welcome_4_community':
            subject = 'Join the ØBEX Community!';
            htmlContent = generateWelcome4Email(customerName, metadata);
            break;
          case 'welcome_5_feedback':
            subject = 'How is ØBEX working for you?';
            htmlContent = generateWelcome5Email(customerName, metadata);
            break;
          default:
            console.warn(`Unknown email type: ${emailType} for email ID: ${email.id}`);
            // Update status to failed to avoid retrying unknown types
            await supabaseAdmin
              .from('scheduled_emails')
              .update({ status: 'failed', attempt_count: email.attempt_count + 1 })
              .eq('id', email.id);
            emailsFailed++;
            continue; // Skip to the next email
        }

        // 4. Send Email via Resend
        console.log(`Attempting to send ${emailType} to ${email.customer_email} (Attempt ${email.attempt_count + 1})`);
        const { error: sendError } = await resend.emails.send({
          from: 'ØBEX <support@obexcanada.com>', 
          to: [email.customer_email],
          subject: subject,
          html: htmlContent,
        });

        if (sendError) {
          throw sendError; // Let the catch block handle Resend errors
        }

        // 5. Update Email Status to 'sent' in Supabase
        await supabaseAdmin
          .from('scheduled_emails')
          .update({ status: 'sent' })
          .eq('id', email.id);

        console.log(`✅ Email ${emailType} sent successfully to ${email.customer_email}`);
        emailsSent++;

      } catch (processError) {
        // 6. Handle Errors and Update Status to 'failed' or retry
        console.error(`❌ Failed to process email ID ${email.id} (${emailType}) for ${email.customer_email}:`, processError);
        emailsFailed++;
        const newAttemptCount = email.attempt_count + 1;
        const newStatus = newAttemptCount >= MAX_SEND_ATTEMPTS ? 'failed' : 'pending'; // Keep pending for retry if under max attempts

        await supabaseAdmin
          .from('scheduled_emails')
          .update({
            status: newStatus,
            attempt_count: newAttemptCount,
          })
          .eq('id', email.id);
      }
    }

    console.log(`Cron job finished. Sent: ${emailsSent}, Failed: ${emailsFailed}`);
    return NextResponse.json({
      message: `Processed ${emails.length} emails. Sent: ${emailsSent}, Failed: ${emailsFailed}`,
    });

  } catch (error) {
    console.error('Unhandled error in cron job:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
} 