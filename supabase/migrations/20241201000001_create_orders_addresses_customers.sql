-- Create customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  phone TEXT,
  stripe_customer_id TEXT UNIQUE,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create addresses table
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'shipping' CHECK (type IN ('shipping', 'billing')),
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  state TEXT,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'CA',
  is_default BOOLEAN DEFAULT FALSE
);

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'CAD',
  shipping_address_id UUID REFERENCES public.addresses(id),
  billing_address_id UUID REFERENCES public.addresses(id),
  tracking_number TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_stripe_id ON public.customers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_addresses_customer ON public.addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON public.orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- Add updated_at triggers
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at
  BEFORE UPDATE ON public.addresses
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customers table
-- Users can only see their own customer record
CREATE POLICY "Users can view own customer record" ON public.customers
  FOR SELECT USING (auth.email() = email);

CREATE POLICY "Users can update own customer record" ON public.customers
  FOR UPDATE USING (auth.email() = email);

-- Service role and authenticated users can insert (for order processing)
CREATE POLICY "Service can insert customers" ON public.customers
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Admin users can do anything
CREATE POLICY "Admin users can manage all customers" ON public.customers
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- RLS Policies for addresses table
-- Users can only see addresses linked to their customer record
CREATE POLICY "Users can view own addresses" ON public.addresses
  FOR SELECT USING (
    customer_id IN (
      SELECT id FROM public.customers WHERE auth.email() = email
    )
  );

CREATE POLICY "Users can update own addresses" ON public.addresses
  FOR UPDATE USING (
    customer_id IN (
      SELECT id FROM public.customers WHERE auth.email() = email
    )
  );

-- Service role can insert/manage addresses
CREATE POLICY "Service can manage addresses" ON public.addresses
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- RLS Policies for orders table
-- Users can only see orders linked to their customer record
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (
    customer_id IN (
      SELECT id FROM public.customers WHERE auth.email() = email
    )
  );

-- Service role can manage orders (for webhook processing)
CREATE POLICY "Service can manage orders" ON public.orders
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.customers TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.addresses TO authenticated;
GRANT SELECT ON public.orders TO authenticated;

GRANT ALL ON public.customers TO service_role;
GRANT ALL ON public.addresses TO service_role;
GRANT ALL ON public.orders TO service_role; 