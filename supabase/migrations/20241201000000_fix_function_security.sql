-- Fix security issue with update_updated_at_column function
-- This addresses the "role mutable search_path" warning

-- Drop the existing function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Recreate with proper security context
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Ensure proper permissions
REVOKE ALL ON FUNCTION update_updated_at_column() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION update_updated_at_column() TO authenticated;
GRANT EXECUTE ON FUNCTION update_updated_at_column() TO service_role; 