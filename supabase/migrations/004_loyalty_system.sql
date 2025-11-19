-- Create loyalty tiers enum
CREATE TYPE loyalty_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum');

-- Add loyalty tier to profiles
ALTER TABLE profiles
ADD COLUMN loyalty_tier loyalty_tier DEFAULT 'bronze',
ADD COLUMN total_spend INTEGER DEFAULT 0,
ADD COLUMN orders_count INTEGER DEFAULT 0;

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  points_awarded INTEGER DEFAULT 0,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create points_transactions table for tracking
CREATE TABLE IF NOT EXISTS points_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  transaction_type TEXT NOT NULL, -- 'earned', 'redeemed', 'expired'
  description TEXT NOT NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images JSONB,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved_for_later table (cart items saved for later)
CREATE TABLE IF NOT EXISTS saved_for_later (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_data)
);

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  referred_email TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'completed'
  points_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_user_id ON points_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_saved_for_later_user_id ON saved_for_later(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_id ON referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);

-- Function to increment points
CREATE OR REPLACE FUNCTION increment_points(user_uuid UUID, points_to_add INTEGER, description TEXT, order_uuid UUID DEFAULT NULL)
RETURNS VOID AS $$
BEGIN
  -- Add points to profile
  UPDATE profiles
  SET points_balance = points_balance + points_to_add
  WHERE id = user_uuid;

  -- Record transaction
  INSERT INTO points_transactions (user_id, points, transaction_type, description, order_id)
  VALUES (user_uuid, points_to_add, 'earned', description, order_uuid);

  -- Update loyalty tier based on total spend
  UPDATE profiles
  SET loyalty_tier = CASE
    WHEN total_spend >= 50000 THEN 'platinum'::loyalty_tier
    WHEN total_spend >= 20000 THEN 'gold'::loyalty_tier
    WHEN total_spend >= 10000 THEN 'silver'::loyalty_tier
    ELSE 'bronze'::loyalty_tier
  END
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to redeem points
CREATE OR REPLACE FUNCTION redeem_points(user_uuid UUID, points_to_redeem INTEGER, description TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  -- Get current balance
  SELECT points_balance INTO current_balance
  FROM profiles
  WHERE id = user_uuid;

  -- Check if user has enough points
  IF current_balance < points_to_redeem THEN
    RETURN FALSE;
  END IF;

  -- Deduct points
  UPDATE profiles
  SET points_balance = points_balance - points_to_redeem
  WHERE id = user_uuid;

  -- Record transaction
  INSERT INTO points_transactions (user_id, points, transaction_type, description)
  VALUES (user_uuid, -points_to_redeem, 'redeemed', description);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to update order stats
CREATE OR REPLACE FUNCTION update_user_order_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'confirmed' OR NEW.status = 'delivered' THEN
    UPDATE profiles
    SET 
      total_spend = total_spend + NEW.total,
      orders_count = orders_count + 1
    WHERE id = NEW.user_id;

    -- Award points for the order
    PERFORM increment_points(
      NEW.user_id,
      FLOOR(NEW.total / 100),
      'Points earned from order #' || NEW.order_number,
      NEW.id
    );

    -- Check for first order achievement
    IF (SELECT orders_count FROM profiles WHERE id = NEW.user_id) = 1 THEN
      INSERT INTO achievements (user_id, achievement_type, achievement_name, points_awarded)
      VALUES (NEW.user_id, 'first_order', 'First Bunny Box', 100);
      
      PERFORM increment_points(NEW.user_id, 100, 'First Order Achievement', NEW.id);
    END IF;

    -- Check for milestone achievements
    DECLARE
      current_order_count INTEGER;
    BEGIN
      SELECT orders_count INTO current_order_count FROM profiles WHERE id = NEW.user_id;
      
      IF current_order_count = 5 THEN
        INSERT INTO achievements (user_id, achievement_type, achievement_name, points_awarded)
        VALUES (NEW.user_id, 'milestone', 'Bunny Regular', 250);
        PERFORM increment_points(NEW.user_id, 250, '5 Orders Milestone Achievement', NEW.id);
      ELSIF current_order_count = 10 THEN
        INSERT INTO achievements (user_id, achievement_type, achievement_name, points_awarded)
        VALUES (NEW.user_id, 'milestone', 'Bunny Legend', 500);
        PERFORM increment_points(NEW.user_id, 500, '10 Orders Milestone Achievement', NEW.id);
      END IF;
    END;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update stats on order confirmation
CREATE TRIGGER after_order_confirmed
  AFTER INSERT OR UPDATE ON orders
  FOR EACH ROW
  WHEN (NEW.status = 'confirmed' OR NEW.status = 'delivered')
  EXECUTE FUNCTION update_user_order_stats();

-- Add triggers for updated_at
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

