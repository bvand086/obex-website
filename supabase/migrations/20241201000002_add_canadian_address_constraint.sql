-- Migration to add Canadian address constraint
-- This ensures only Canadian addresses can be stored in the addresses table

-- Add CHECK constraint to enforce Canadian addresses only
ALTER TABLE public.addresses 
ADD CONSTRAINT addresses_canadian_only_check 
CHECK (country = 'CA');

-- Update any existing non-Canadian addresses to 'CA' (if any exist)
-- This is a safety measure for existing data
UPDATE public.addresses 
SET country = 'CA' 
WHERE country != 'CA';

-- Add comment to document the constraint
COMMENT ON CONSTRAINT addresses_canadian_only_check ON public.addresses 
IS 'Ensures only Canadian addresses (country = CA) can be stored in the addresses table'; 