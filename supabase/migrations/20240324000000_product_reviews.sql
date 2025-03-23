-- Create product_reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  flavour TEXT NOT NULL,
  email TEXT,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Allow anonymous insert (for form submissions)
CREATE POLICY "Allow anonymous inserts" ON product_reviews 
  FOR INSERT WITH CHECK (true);

-- Only allow read and update for authenticated users
CREATE POLICY "Allow authenticated read" ON product_reviews 
  FOR SELECT USING (auth.role() = 'authenticated');

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE product_reviews;

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_reviews_updated_at
BEFORE UPDATE ON product_reviews
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column(); 