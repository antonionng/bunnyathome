-- Add taste profile fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS taste_profile JSONB DEFAULT '{
  "spice_preference": "medium",
  "dietary_restrictions": [],
  "favorite_cuisines": [],
  "disliked_ingredients": [],
  "completed_at": null
}'::jsonb,
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{
  "email_notifications": true,
  "sms_notifications": false,
  "push_notifications": true,
  "marketing_emails": true
}'::jsonb;

-- Create index for taste profile queries
CREATE INDEX IF NOT EXISTS idx_profiles_taste_profile ON profiles USING GIN (taste_profile);

