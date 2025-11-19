# 🔧 Fixing Common Errors

## Current Issues & Solutions

### 1. ✅ FIXED: Header Not Showing User Profile
**Status:** FIXED - Header now shows user profile with dropdown menu when signed in

### 2. ✅ FIXED: LoadingSkeleton Import Error  
**Status:** FIXED - Changed to use `ProductCardSkeleton`

### 3. ✅ FIXED: Service Worker Cache Errors
**Status:** FIXED - Reduced cached assets to avoid errors

### 4. 🔴 NEEDS ACTION: Supabase 403 Forbidden Errors

**Problem:** Getting `403 Forbidden` errors when fetching profiles and orders

**Root Cause:** Database migrations haven't been applied yet OR RLS policies are not allowing client-side access

**Solution:**

#### Option A: Apply All Migrations (Recommended)
```bash
cd /Users/nueral/BunnyAtHome

# Apply all migrations in order
# You'll need to run these in the Supabase SQL Editor or via Supabase CLI

# 1. Initial Schema
cat supabase/migrations/001_initial_schema.sql

# 2. RLS Policies  
cat supabase/migrations/002_row_level_security.sql

# 3. Seed Data
cat supabase/migrations/003_seed_data.sql

# 4. Loyalty System
cat supabase/migrations/004_loyalty_system.sql

# 5. Cart Improvements
cat supabase/migrations/005_cart_improvements.sql

# 6. Taste Profile
cat supabase/migrations/006_taste_profile.sql

# 7. Referral System
cat supabase/migrations/007_referral_system.sql

# 8. Enhanced Promos
cat supabase/migrations/008_enhanced_promos.sql
```

#### Option B: Manual SQL Editor (Quickest)
1. Go to your Supabase dashboard
2. Click "SQL Editor"
3. Copy and paste each migration file content
4. Run them in order (001 → 008)

#### Option C: Temporarily Disable RLS (NOT RECOMMENDED FOR PRODUCTION)
If you just want to test quickly:

```sql
-- Run in Supabase SQL Editor
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;

-- Re-enable later!
```

### 5. 🔴 NEEDS ACTION: API 500 Errors

**Problem:** `/api/social/recent-orders` and `/api/cart/sync` returning 500 errors

**Root Cause:** Same as #4 - database not set up or RLS blocking API routes

**Solution:**
1. Apply migrations (see above)
2. Check server console for actual error messages
3. Ensure `.env.local` has correct Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 6. ⚠️ Image Aspect Ratio Warnings

**Problem:** Next.js warning about image aspect ratios

**Solution:** Add `style` prop to images OR use consistent width/height

**File:** `/public/trustpilot-star-4-5.webp` and `/logo.png`

Quick fix - add to any problematic images:
```tsx
<Image 
  src="/logo.png"
  alt="Logo"
  width={48}
  height={48}
  style={{ width: 'auto', height: 'auto' }}
/>
```

---

## Quick Database Setup Guide

### Step 1: Verify Supabase Connection
```bash
# Test connection
npm run dev

# Check browser console for connection errors
```

### Step 2: Apply Migrations

**Via Supabase Dashboard:**
1. Login to supabase.com
2. Select your project
3. Go to "SQL Editor"
4. Run each migration file in order:
   - 001_initial_schema.sql
   - 002_row_level_security.sql
   - 003_seed_data.sql
   - 004_loyalty_system.sql
   - 005_cart_improvements.sql
   - 006_taste_profile.sql
   - 007_referral_system.sql
   - 008_enhanced_promos.sql

**Via Supabase CLI (if installed):**
```bash
# Initialize Supabase (if not done)
supabase init

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### Step 3: Verify Tables Created
In Supabase Dashboard → Table Editor, you should see:
- profiles
- addresses
- orders
- saved_boxes
- subscriptions
- promo_codes
- cart_items
- referrals
- reviews (optional)

### Step 4: Create Test User
```bash
# Go to Supabase Dashboard → Authentication → Users
# Click "Add user"
# Create with email and password
```

### Step 5: Restart Dev Server
```bash
npm run dev
```

---

## Verification Checklist

After applying fixes:

- [ ] Header shows user name/email when logged in
- [ ] No LoadingSkeleton import errors in console
- [ ] Service worker installs without cache errors
- [ ] Profile loads without 403 errors
- [ ] Orders load without 403 errors
- [ ] Cart syncs without 500 errors
- [ ] Recent orders feed works without 500 errors
- [ ] No aspect ratio warnings (or acceptable if working)

---

## Still Having Issues?

### Check Server Logs
Look at the terminal running `npm run dev` for server-side errors

### Check Browser Console
Look for specific error messages

### Common Issues:

**"User not found"**
- Make sure you're signed in
- Check that auth token is valid
- Try signing out and back in

**"Table doesn't exist"**
- Migrations not applied
- Wrong database selected
- Check Supabase project URL

**"Permission denied"**
- RLS policies not applied
- Wrong user trying to access data
- Check auth.uid() matches user_id

---

## Quick Test Queries

Run these in Supabase SQL Editor to test:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check policies
SELECT * FROM pg_policies 
WHERE schemaname = 'public';

-- Test user profile (replace with your user ID)
SELECT * FROM profiles 
WHERE id = 'your-user-id';
```

---

## Need More Help?

1. Check the main implementation guide: `COMPLETE_IMPLEMENTATION_GUIDE.md`
2. See quick start: `DEVELOPER_QUICK_START.md`
3. Check Supabase docs: https://supabase.com/docs
4. Verify environment variables in `.env.local`

---

**Last Updated:** November 14, 2025  
**Status:** Most errors fixed, RLS setup required

