#!/usr/bin/env node

/**
 * Bunny At Home - Database Migration Runner
 * 
 * This script applies all database migrations to your Supabase database
 * using the Supabase client with service role key.
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Check for required environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: Missing environment variables!');
  console.error('Please ensure .env.local contains:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Import Supabase client
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const MIGRATIONS_DIR = path.join(__dirname, 'supabase', 'migrations');

async function runMigration(filename) {
  console.log(`\n📄 Running: ${filename}`);
  
  const filePath = path.join(MIGRATIONS_DIR, filename);
  const sql = fs.readFileSync(filePath, 'utf8');
  
  try {
    const { error } = await supabase.rpc('exec_sql', { sql_string: sql });
    
    if (error) {
      console.error(`❌ Error in ${filename}:`, error.message);
      return false;
    }
    
    console.log(`✅ Successfully applied: ${filename}`);
    return true;
  } catch (err) {
    console.error(`❌ Failed to run ${filename}:`, err.message);
    return false;
  }
}

async function main() {
  console.log('🐰 Bunny At Home - Database Migration Runner');
  console.log('============================================\n');
  
  // Get all migration files
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();
  
  console.log(`Found ${files.length} migration files:\n`);
  files.forEach((f, i) => {
    console.log(`  ${i + 1}. ${f}`);
  });
  
  console.log('\n⚡ Starting migration process...\n');
  
  let successCount = 0;
  
  for (const file of files) {
    const success = await runMigration(file);
    if (success) successCount++;
    
    // Small delay between migrations
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n============================================');
  console.log(`✅ Completed: ${successCount}/${files.length} migrations`);
  
  if (successCount === files.length) {
    console.log('\n🎉 All migrations applied successfully!');
    console.log('\n📝 Next steps:');
    console.log('  1. Restart your dev server: npm run dev');
    console.log('  2. Sign in and test all features');
    console.log('  3. Check Supabase Table Editor to verify tables');
  } else {
    console.log('\n⚠️  Some migrations failed. Please check the errors above.');
    console.log('You may need to run them manually in Supabase SQL Editor.');
  }
}

main().catch(console.error);

