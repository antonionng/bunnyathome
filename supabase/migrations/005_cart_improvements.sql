-- Add email_sent_at field to cart_items for abandoned cart tracking
ALTER TABLE cart_items
ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMP WITH TIME ZONE;

-- Create index for abandoned cart queries
CREATE INDEX IF NOT EXISTS idx_cart_items_abandoned 
ON cart_items(updated_at, email_sent_at) 
WHERE email_sent_at IS NULL;

