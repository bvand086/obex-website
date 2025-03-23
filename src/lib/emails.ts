import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

export type EmailType = 
  | 'welcome_1' 
  | 'welcome_2_usage' 
  | 'welcome_3_education' 
  | 'welcome_4_community' 
  | 'welcome_5_feedback';

interface ScheduleEmailParams {
  customerEmail: string;
  customerName?: string;
  emailType: EmailType;
  sendAt: Date;
  metadata?: Record<string, any>;
  orderId: string;
}

/**
 * Add days to a date and return a new Date object
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Schedule an email to be sent at a specific time
 */
export async function scheduleEmail({
  customerEmail,
  customerName,
  emailType,
  sendAt,
  metadata = {},
  orderId
}: ScheduleEmailParams) {
  try {
    const id = uuidv4();
    
    const { error } = await supabase
      .from('scheduled_emails')
      .insert({
        id,
        customer_email: customerEmail,
        customer_name: customerName || null,
        email_type: emailType,
        send_at: sendAt.toISOString(),
        metadata,
        status: 'pending',
        order_id: orderId,
        attempt_count: 0
      });
    
    if (error) {
      console.error('Error scheduling email:', error);
      throw error;
    }
    
    console.log(`✅ Email ${emailType} scheduled for ${sendAt.toISOString()}`);
    return id;
  } catch (error) {
    console.error('Error in scheduleEmail:', error);
    throw error;
  }
}

/**
 * Schedule the full welcome sequence for a new customer
 */
export async function scheduleWelcomeSequence({
  customerEmail,
  customerName,
  orderId,
  metadata = {},
  currentDate = new Date()
}: {
  customerEmail: string;
  customerName?: string;
  orderId: string;
  metadata?: Record<string, any>;
  currentDate?: Date;
}) {
  try {
    console.log(`📧 Scheduling welcome sequence for ${customerEmail}`);
    
    // Email 2: How to use Obex effectively - 3 DAYS LATER
    const email2Date = addDays(currentDate, 3);
    await scheduleEmail({
      customerEmail,
      customerName,
      emailType: 'welcome_2_usage',
      sendAt: email2Date,
      metadata,
      orderId
    });
    
    // Email 3: Educational content about reflux management - 7 DAYS LATER (10 days from purchase)
    const email3Date = addDays(currentDate, 10);
    await scheduleEmail({
      customerEmail,
      customerName,
      emailType: 'welcome_3_education',
      sendAt: email3Date,
      metadata,
      orderId
    });
    
    // Email 4: Invitation to join community/social media - 14 DAYS LATER (24 days from purchase)
    const email4Date = addDays(currentDate, 24);
    await scheduleEmail({
      customerEmail,
      customerName,
      emailType: 'welcome_4_community',
      sendAt: email4Date,
      metadata,
      orderId
    });
    
    // Email 5: Request for feedback - 14 DAYS LATER (38 days from purchase)
    const email5Date = addDays(currentDate, 38);
    await scheduleEmail({
      customerEmail,
      customerName,
      emailType: 'welcome_5_feedback',
      sendAt: email5Date,
      metadata,
      orderId
    });
    
    console.log(`✅ Welcome sequence scheduled for ${customerEmail}`);
  } catch (error) {
    console.error('Error scheduling welcome sequence:', error);
    throw error;
  }
} 