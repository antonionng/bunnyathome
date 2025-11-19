# 🐰 Database Setup Instructions

## The Problem
You're getting **403 Forbidden** errors because your Supabase database needs the Row Level Security (RLS) policies and tables set up.

## The Solution (5 minutes)

### Step 1: Open Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project: **vknwvnzjszleaqbtkxsn**
3. Click **SQL Editor** in the left sidebar

### Step 2: Run the Migration
1. Click **+ New query** button
2. Open the file: `supabase/ALL_MIGRATIONS.sql`
3. Copy **ALL** the contents (414 lines)
4. Paste into the Supabase SQL Editor
5. Click **Run** (or press Cmd/Ctrl + Enter)

### Step 3: Verify Success
You should see: ✅ **Success. No rows returned**

This means all tables and policies were created successfully!

### Step 4: Create a Profile for Your Existing User

If you already have a user account, you need to create a profile for it:

1. In Supabase SQL Editor, run this query:

```sql
-- Check if you have any users without profiles
SELECT 
  u.id, 
  u.email,
  p.id as profile_id
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE p.id IS NULL;
```

2. If you see a user without a profile, create one with:

```sql
-- Replace 'YOUR-USER-ID-HERE' with the actual user ID from the query above
INSERT INTO profiles (id, referral_code)
VALUES (
  'YOUR-USER-ID-HERE',
  substring(md5(random()::text), 1, 8)
)
ON CONFLICT (id) DO NOTHING;
```

Or use the function:

```sql
-- This will create profiles for all users that don't have one
INSERT INTO profiles (id, referral_code)
SELECT id, generate_referral_code()
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;
```

### Step 5: Restart Your App
```bash
# Stop your dev server (Ctrl+C)
# Then restart it:
npm run dev
```

## ✅ Done!
Your database is now fully configured with:
- ✅ All tables created
- ✅ Row Level Security enabled
- ✅ Proper access policies
- ✅ Automatic profile creation for new users
- ✅ Helper functions

## Troubleshooting

### Still getting 403 errors?
1. Make sure you're logged in
2. Check that your user has a profile:
   - Go to Supabase Dashboard → Table Editor → profiles
   - Look for your user ID
3. If no profile exists, run the profile creation query above

### Can't see any tables?
- The migration failed. Check the error message in the SQL Editor
- Common issue: Trigger already exists → Safe to ignore
- Try running individual sections if needed

### Need to reset everything?
```sql
-- ⚠️ WARNING: This deletes ALL data!
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS saved_boxes CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS promo_codes CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Then run the ALL_MIGRATIONS.sql again
```

## Next Steps
1. Sign up or log in to your app
2. Test creating a bunny box
3. Check your cart
4. Everything should work now! 🎉

