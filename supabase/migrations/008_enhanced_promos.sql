-- Add enhanced promo features to promo_codes table
ALTER TABLE promo_codes
ADD COLUMN IF NOT EXISTS auto_apply BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS stackable BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS category_restrictions JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS customer_restrictions JSONB DEFAULT '{
  "new_customers_only": false,
  "loyalty_tier_required": null,
  "previous_orders_min": null
}'::jsonb,
ADD COLUMN IF NOT EXISTS usage_per_user INTEGER,
ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0;

-- Create index for auto-apply lookups
CREATE INDEX IF NOT EXISTS idx_promo_codes_auto_apply ON promo_codes(auto_apply) WHERE auto_apply = true AND active = true;

-- Create promo usage tracking table
CREATE TABLE IF NOT EXISTS promo_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id UUID NOT NULL REFERENCES promo_codes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  discount_amount INTEGER NOT NULL,
  used_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(promo_code_id, user_id, order_id)
);

CREATE INDEX IF NOT EXISTS idx_promo_usage_user ON promo_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_promo_usage_promo ON promo_usage(promo_code_id);

-- Function to check if user can use promo
CREATE OR REPLACE FUNCTION can_use_promo(
  promo_id UUID,
  user_uuid UUID,
  cart_total INTEGER
)
RETURNS JSONB AS $$
DECLARE
  promo RECORD;
  user_profile RECORD;
  usage_count INTEGER;
  order_count INTEGER;
  result JSONB;
BEGIN
  -- Get promo details
  SELECT * INTO promo FROM promo_codes WHERE id = promo_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'Promo code not found');
  END IF;

  -- Check if active
  IF NOT promo.active THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'Promo code is inactive');
  END IF;

  -- Check validity period
  IF promo.valid_from IS NOT NULL AND now() < promo.valid_from THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'Promo code not yet valid');
  END IF;

  IF promo.valid_until IS NOT NULL AND now() > promo.valid_until THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'Promo code expired');
  END IF;

  -- Check usage limits
  IF promo.max_uses IS NOT NULL AND promo.current_uses >= promo.max_uses THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'Promo code usage limit reached');
  END IF;

  -- Check per-user usage limit
  IF promo.usage_per_user IS NOT NULL THEN
    SELECT COUNT(*) INTO usage_count
    FROM promo_usage
    WHERE promo_code_id = promo_id AND user_id = user_uuid;

    IF usage_count >= promo.usage_per_user THEN
      RETURN jsonb_build_object('valid', false, 'reason', 'You have already used this promo code');
    END IF;
  END IF;

  -- Check minimum order value
  IF promo.minimum_order_value IS NOT NULL AND cart_total < promo.minimum_order_value THEN
    RETURN jsonb_build_object(
      'valid', false, 
      'reason', format('Minimum order value of £%s required', (promo.minimum_order_value / 100.0))
    );
  END IF;

  -- Get user profile for customer restrictions
  SELECT * INTO user_profile FROM profiles WHERE id = user_uuid;

  -- Check new customers only
  IF (promo.customer_restrictions->>'new_customers_only')::boolean THEN
    SELECT COUNT(*) INTO order_count FROM orders WHERE user_id = user_uuid;
    IF order_count > 0 THEN
      RETURN jsonb_build_object('valid', false, 'reason', 'This promo is for new customers only');
    END IF;
  END IF;

  -- Check loyalty tier requirement
  IF promo.customer_restrictions->>'loyalty_tier_required' IS NOT NULL THEN
    IF user_profile.loyalty_tier != promo.customer_restrictions->>'loyalty_tier_required' THEN
      RETURN jsonb_build_object(
        'valid', false, 
        'reason', format('This promo requires %s tier', promo.customer_restrictions->>'loyalty_tier_required')
      );
    END IF;
  END IF;

  -- All checks passed
  RETURN jsonb_build_object('valid', true);
END;
$$ LANGUAGE plpgsql;

