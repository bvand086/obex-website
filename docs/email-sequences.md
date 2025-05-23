# Email Sequence System Documentation

## Overview

The ØBEX email sequence system uses a combination of Vercel Cron Jobs, Supabase, and Resend to deliver a series of welcome and educational emails to customers after they make a purchase. This approach provides a reliable, cost-effective solution with minimal external dependencies.

## Technical Implementation

### Components

1. **Supabase Database**: Stores scheduled email information in the `scheduled_emails` table.
2. **Stripe Webhook Handler**: Processes checkout events and schedules follow-up emails.
3. **Vercel Cron Job**: Runs periodically to check for and send emails that are due.
4. **Resend API**: Handles the actual email sending with high deliverability.

### Database Schema

The `scheduled_emails` table includes the following fields:

- `id`: Unique identifier (UUID)
- `created_at`: When the email was scheduled
- `send_at`: When the email should be sent
- `customer_email`: Recipient email address
- `customer_name`: Recipient name (optional)
- `email_type`: Type of email to send (e.g., 'welcome_2_usage')
- `status`: Current status ('pending', 'sent', or 'failed')
- `metadata`: JSON data with customer and order details
- `order_id`: Related Stripe order ID
- `attempt_count`: Number of send attempts

### Email Types

The system supports the following email types:

1. **welcome_1**: Order confirmation (sent immediately by the webhook)
2. **welcome_2_usage**: Usage instructions (sent 3 days after purchase)
3. **welcome_3_education**: Educational content about acid reflux (sent 10 days after purchase)
4. **welcome_5_feedback**: Request for product feedback (sent 21 days after purchase)
5. **welcome_4_community**: Information about joining the community (sent 35 days after purchase)

## Process Flow

1. **Order Placed**: Customer completes checkout via Stripe.
2. **Webhook Triggered**: Stripe sends a webhook event to `/api/webhook`.
3. **Flavor Extraction**: Bulletproof flavor information extraction with multiple fallback strategies.
4. **Initial Emails**: Confirmation email sent to customer and detailed internal notification sent to staff.
5. **Emails Scheduled**: Follow-up emails are scheduled in the Supabase `scheduled_emails` table.
6. **Cron Job Execution**: Vercel runs the cron job every 15 minutes.
7. **Email Processing**: The cron job handler checks for due emails, sends them via Resend, and updates their status.
8. **Retry Logic**: Failed emails are retried up to 3 times before being marked as permanently failed.

## Implementation Details

### Webhook Handler (`/api/webhook/route.ts`)

The webhook handler is responsible for:
- Verifying the Stripe webhook signature
- Sending the immediate order confirmation email
- Scheduling follow-up emails in the Supabase database

### Cron Job Handler (`/api/cron/process-emails/route.ts`)

The cron job handler:
- Authenticates the request using a secret key
- Queries Supabase for pending emails that are due
- Generates email content based on email type
- Sends emails via Resend
- Updates email status in the database
- Handles retry logic for failed sends

### Email Templates (`/lib/emailTemplates.ts`)

Contains functions to generate HTML content for each email type.

## Security

The cron job endpoint is protected by the `CRON_SECRET` environment variable. Vercel's built-in authentication for cron jobs ensures that only authorized requests can trigger the email processing.

## Configuration

### Email Schedule Timing

The timing for follow-up emails is optimized for customer engagement without being annoying:

```typescript
const schedule = [
  { type: 'welcome_2_usage', days: 3 },      // Usage tips when they first receive the product
  { type: 'welcome_3_education', days: 10 }, // Educational content after they've tried it
  { type: 'welcome_5_feedback', days: 21 },  // Feedback request after 3 weeks of use
  { type: 'welcome_4_community', days: 35 }, // Community engagement when they're committed
];
```

### Cron Job Frequency

The cron job runs every 15 minutes, as defined in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/process-emails",
      "schedule": "*/15 * * * *"
    }
  ]
}
```

## Environment Variables

The following environment variables are required:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase public key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (for backend operations)
- `RESEND_API_KEY`: Resend API key
- `STRIPE_SECRET_KEY`: Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret
- `CRON_SECRET`: Secret for authenticating cron job requests

## Flavor Information Extraction

The system now includes bulletproof flavor extraction with multiple fallback strategies:

1. **Primary**: `session.metadata.shipping_flavors`
2. **Secondary**: `session.metadata.SHIPPING_GUIDE`
3. **Tertiary**: Cart items (`ship_flavors`, `flavor_breakdown`, `flavor`)
4. **Fallback**: Custom fields (`chooseyourflavour`)

If all strategies fail, the system will:
- Display a prominent warning in the internal email
- Log detailed debugging information
- Request manual review of the order

This ensures that flavor information is NEVER lost and internal processing can continue reliably.

## Customization

### Email Content

To modify the content of emails, edit the template functions in `/lib/emailTemplates.ts`.

### Email Schedule

To change when emails are sent, update the `schedule` array in the webhook handler.

### Email Frequency

To change how often the system checks for emails to send, modify the `schedule` parameter in `vercel.json`.

## Monitoring and Debugging

- **Vercel Logs**: Check the function logs in the Vercel dashboard
- **Database Inspection**: Query the `scheduled_emails` table in Supabase
- **Resend Dashboard**: Monitor email deliverability and open rates

## Error Handling

The system includes several error handling mechanisms:

1. **Send Retries**: Failed emails are retried up to 3 times
2. **Status Tracking**: Email status is tracked in the database
3. **Detailed Logging**: Errors are logged for troubleshooting

## Testing

To test the system:

1. Make a test purchase through Stripe (using test mode)
2. Verify that rows are added to the `scheduled_emails` table
3. Manually adjust the `send_at` time for a test email to the current time
4. Wait for the cron job to run or trigger it manually
5. Verify that the email is sent and the status is updated 