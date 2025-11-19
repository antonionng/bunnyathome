#!/bin/bash

# Bunny At Home - Manual Migration Guide
# This script helps you apply migrations via Supabase SQL Editor

echo "🐰 Bunny At Home - Migration Setup Guide"
echo "========================================"
echo ""
echo "Since direct SQL execution requires database extensions,"
echo "we'll use the Supabase SQL Editor (easiest method)."
echo ""
echo "📋 Steps to apply migrations:"
echo ""
echo "1️⃣  Open Supabase Dashboard:"
echo "   https://supabase.com/dashboard"
echo ""
echo "2️⃣  Select your project and go to SQL Editor"
echo ""
echo "3️⃣  For each migration file below, copy its contents and run:"
echo ""

# List all migration files
for file in supabase/migrations/*.sql; do
    filename=$(basename "$file")
    echo "   📄 $filename"
done

echo ""
echo "4️⃣  Verify tables created in Table Editor"
echo ""
echo "5️⃣  Restart dev server: npm run dev"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 Quick Copy - Migration 001 (Tables):"
echo ""
cat supabase/migrations/001_initial_schema.sql
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Copy the SQL above and paste into Supabase SQL Editor"
echo "   Then click 'Run' to create all tables"
echo ""
echo "📝 After running 001, continue with 002-008 in order"
echo ""

