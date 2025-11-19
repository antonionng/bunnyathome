-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  referral_code TEXT NOT NULL UNIQUE,
  referred_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'signed_up', 'completed_order')),
  reward_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  CONSTRAINT fk_referrer FOREIGN KEY (referrer_id) REFERENCES profiles(id)
);

-- Add referral code to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES profiles(id);

-- Create index for lookups
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text) from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM profiles WHERE referral_code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate referral code on profile creation
CREATE OR REPLACE FUNCTION create_referral_code_trigger()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_referral_code ON profiles;
CREATE TRIGGER set_referral_code
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_referral_code_trigger();

-- Function to process referral reward
CREATE OR REPLACE FUNCTION process_referral_reward(referred_user_id UUID)
RETURNS VOID AS $$
DECLARE
  referrer_user_id UUID;
  reward_amount INTEGER := 500;
BEGIN
  -- Get referrer
  SELECT referred_by INTO referrer_user_id
  FROM profiles
  WHERE id = referred_user_id;

  IF referrer_user_id IS NOT NULL THEN
    -- Award points to referrer
    UPDATE profiles
    SET points_balance = points_balance + reward_amount
    WHERE id = referrer_user_id;

    -- Award points to referred user
    UPDATE profiles
    SET points_balance = points_balance + 200
    WHERE id = referred_user_id;

    -- Update referral record
    UPDATE referrals
    SET 
      status = 'completed_order',
      completed_at = now(),
      reward_points = reward_amount
    WHERE referred_id = referred_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

