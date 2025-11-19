-- Add comprehensive settings columns to profiles table

-- Add new columns for user preferences and settings
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS preferred_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dietary_preferences TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS spice_level INTEGER DEFAULT 3;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"order_updates": true, "marketing": true, "recipes": true}'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS communication_preferences JSONB DEFAULT '{"email": true, "sms": false, "whatsapp": false}'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS timezone TEXT DEFAULT 'Europe/London';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS two_factor_secret TEXT;

-- Add constraints
ALTER TABLE profiles ADD CONSTRAINT spice_level_range CHECK (spice_level >= 1 AND spice_level <= 5);
ALTER TABLE profiles ADD CONSTRAINT language_valid CHECK (language IN ('en', 'af', 'zu'));

-- Add indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_profiles_preferred_name ON profiles(preferred_name);
CREATE INDEX IF NOT EXISTS idx_profiles_two_factor_enabled ON profiles(two_factor_enabled);

-- Add comment for documentation
COMMENT ON COLUMN profiles.preferred_name IS 'User preferred name or nickname for personalization';
COMMENT ON COLUMN profiles.dietary_preferences IS 'Dietary restrictions (vegetarian, halal, allergies, etc.)';
COMMENT ON COLUMN profiles.spice_level IS 'User spice tolerance level (1-5 scale)';
COMMENT ON COLUMN profiles.notification_preferences IS 'JSON object with notification toggle preferences';
COMMENT ON COLUMN profiles.communication_preferences IS 'JSON object with communication channel preferences';
COMMENT ON COLUMN profiles.two_factor_secret IS 'Encrypted TOTP secret for 2FA authentication';

