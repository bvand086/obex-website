-- Create scheduled_emails table for email sequence management
CREATE TABLE IF NOT EXISTS public.scheduled_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  send_at TIMESTAMPTZ NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  email_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  metadata JSONB DEFAULT '{}'::jsonb,
  order_id TEXT NOT NULL,
  attempt_count INTEGER DEFAULT 0 NOT NULL
);

-- Add index for efficient querying of pending emails
CREATE INDEX IF NOT EXISTS idx_scheduled_emails_status_send_at 
ON public.scheduled_emails (status, send_at);

-- Add index for finding emails by customer
CREATE INDEX IF NOT EXISTS idx_scheduled_emails_customer_email 
ON public.scheduled_emails (customer_email);

-- Add index for finding emails by order
CREATE INDEX IF NOT EXISTS idx_scheduled_emails_order_id 
ON public.scheduled_emails (order_id);

-- Create RLS policies
ALTER TABLE public.scheduled_emails ENABLE ROW LEVEL SECURITY;

-- Only allow authenticated users with admin role to access
CREATE POLICY "Admin users can do anything" ON public.scheduled_emails
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scheduled_emails TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scheduled_emails TO service_role; 