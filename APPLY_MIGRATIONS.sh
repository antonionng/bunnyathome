#!/bin/bash

# Bunny At Home - Database Migration Script
# This script helps you apply all migrations to your Supabase database

echo "🐰 Bunny At Home - Database Setup"
echo "=================================="
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local not found!"
    echo "Please create .env.local with your Supabase credentials"
    exit 1
fi

echo "📋 Migration Files Found:"
echo ""
ls -1 supabase/migrations/
echo ""

echo "⚠️  IMPORTANT: These migrations must be run in your Supabase SQL Editor"
echo ""
echo "Steps to apply migrations:"
echo "1. Go to your Supabase Dashboard (https://supabase.com/dashboard)"
echo "2. Select your project"
echo "3. Navigate to 'SQL Editor'"
echo "4. Copy and paste each migration file in order"
echo "5. Click 'Run' for each one"
echo ""
echo "Migration order:"
echo "  1️⃣  001_initial_schema.sql       - Creates all tables"
echo "  2️⃣  002_row_level_security.sql   - Sets up RLS policies"
echo "  3️⃣  003_seed_data.sql            - Adds sample data"
echo "  4️⃣  004_loyalty_system.sql       - Loyalty points system"
echo "  5️⃣  005_cart_improvements.sql    - Cart sync features"
echo "  6️⃣  006_taste_profile.sql        - User taste profiles"
echo "  7️⃣  007_referral_system.sql      - Referral program"
echo "  8️⃣  008_enhanced_promos.sql      - Advanced promo system"
echo ""

read -p "Would you like to see the first migration? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo ""
    echo "📄 001_initial_schema.sql:"
    echo "=========================="
    cat supabase/migrations/001_initial_schema.sql
    echo ""
    echo "Copy the above and paste into Supabase SQL Editor"
fi

echo ""
echo "✅ After running all migrations, your database will be ready!"
echo "🚀 Then run: npm run dev"
echo ""

