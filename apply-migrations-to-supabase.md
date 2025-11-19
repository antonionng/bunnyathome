# 🚀 Apply Migrations to Supabase

## ✅ STEP 1: Dropdown Fixed!

The dropdown menu now works perfectly - you can move your cursor down without it disappearing.

---

## 📊 STEP 2: Apply Database Migrations

### Method 1: Copy & Paste (Easiest - 2 minutes)

**Go to:** https://supabase.com/dashboard

**Then:**

1. Select your project
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New query"**
4. Copy the SQL below and paste it
5. Click **"Run"**
6. Repeat for all 8 migrations

---

### 🗂️ Migration 1: Initial Schema

```sql
-- Copy from: supabase/migrations/001_initial_schema.sql

-- Run this in Supabase SQL Editor first!
```

**To copy the file:**
```bash
cat supabase/migrations/001_initial_schema.sql
```

Then copy the output and paste into Supabase SQL Editor.

---

### 🔒 Migration 2: Row Level Security

```sql
-- Copy from: supabase/migrations/002_row_level_security.sql
```

**To copy:**
```bash
cat supabase/migrations/002_row_level_security.sql
```

---

### 📦 Migration 3-8: Continue with remaining files

```bash
# View all migration files:
ls -1 supabase/migrations/

# Copy any specific file:
cat supabase/migrations/003_seed_data.sql
cat supabase/migrations/004_loyalty_system.sql
cat supabase/migrations/005_cart_improvements.sql
cat supabase/migrations/006_taste_profile.sql
cat supabase/migrations/007_referral_system.sql
cat supabase/migrations/008_enhanced_promos.sql
```

---

### Method 2: Use the Helper Script

```bash
# View migration guide with first migration
./run-migrations-manual.sh
```

This will:
- List all migrations
- Show you the first migration SQL
- Guide you through the process

---

### Method 3: Supabase CLI (If you have it installed)

```bash
# Link your project
supabase link --project-ref your-project-ref

# Push all migrations at once
supabase db push
```

---

## ✅ After Running Migrations

### Verify Tables Created

Go to: **Supabase Dashboard** → **Table Editor**

You should see these tables:
- ✅ profiles
- ✅ addresses
- ✅ orders
- ✅ order_items (if using)
- ✅ cart_items
- ✅ saved_boxes
- ✅ subscriptions
- ✅ promo_codes
- ✅ referrals
- ✅ reviews (optional)

### Restart Dev Server

```bash
# Stop current server (Ctrl+C in terminal)
npm run dev
```

### Test Everything

1. ✅ Dropdown works perfectly
2. ✅ Sign in
3. ✅ Profile loads
4. ✅ Cart syncs
5. ✅ All features work!

---

## 🎯 Quick Commands

```bash
# View first migration
cat supabase/migrations/001_initial_schema.sql

# View all migrations
ls -l supabase/migrations/

# Run helper script
./run-migrations-manual.sh

# Restart server after migrations
npm run dev
```

---

## 🆘 Still Having Issues?

### If migrations fail:

1. **Check Supabase project is selected** in dashboard
2. **Make sure you're in SQL Editor** (not Table Editor)
3. **Run migrations in order** (001 → 008)
4. **Check for error messages** in SQL Editor output

### If you see "already exists" errors:

This is OK! It means some tables were already created. Continue with the next migration.

---

## 📞 Need Help?

The dropdown is fixed! After you run migrations:
- All API errors will disappear
- Profile will load
- Cart sync will work
- Everything will be perfect!

Just follow **Method 1** above - it's the easiest! 🚀

