# ØBEX Email Sequence System

This document explains the email sequence system implemented for ØBEX to enhance customer communication and engagement.

## Overview

The system automatically sends a series of follow-up emails to customers after they make a purchase. These emails are spread out over time to deliver timely information and maintain engagement without overwhelming the customer.

## Email Sequence

The welcome sequence consists of 5 emails:

1. **Welcome and Thank You (Immediate)** - Sent immediately after purchase through the webhook
2. **How to Use Obex Effectively (Day 3)** - Sent 3 days after purchase
3. **Educational Content About Reflux Management (Day 10)** - Sent 10 days after purchase
4. **Invitation to Join Community/Social Media (Day 24)** - Sent 24 days after purchase
5. **Request for Feedback (Day 38)** - Sent 38 days after purchase

## Technical Implementation

The system uses:

- **Supabase** for storing scheduled emails
- **Resend** for sending emails
- **Vercel Cron Jobs** for processing scheduled emails

### Components

1. **Database Schema**: `scheduled_emails` table in Supabase
2. **Webhook Handler**: `src/app/api/webhook/route.ts` schedules the email sequence when a purchase is made
3. **Email Scheduler**: `src/lib/emails.ts` contains helper functions for scheduling emails
4. **Email Processor**: `src/app/api/cron/process-emails/route.ts` processes and sends pending emails
5. **Cron Job**: Configured in `vercel.json` to run every 15 minutes

### Process Flow

1. When a customer makes a purchase, the webhook handler sends the immediate welcome email.
2. The handler then schedules all follow-up emails in the Supabase database.
3. The cron job runs every 15 minutes, checking for emails that are due to be sent.
4. When an email is due, the processor sends it via Resend and updates its status.

## Security

- The cron job endpoint is protected by an API key (CRON_SECRET)
- Supabase Row Level Security (RLS) ensures only authenticated users can access the email data

## Customization

To modify the email content or schedule:

1. **Email Templates**: Update the email templates in `src/app/api/cron/process-emails/route.ts`
2. **Email Schedule**: Update the timing in `src/lib/emails.ts` in the `scheduleWelcomeSequence` function

## Monitoring

The system logs all activities to the console, which can be viewed in Vercel logs. Additionally, email statuses are tracked in the database with counts of send attempts to handle failures gracefully. 