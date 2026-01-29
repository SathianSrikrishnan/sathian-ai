// Run this script to set up the Supabase database tables
// Usage: node scripts/setup-db.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://tvujxgdwgvrunjvhseey.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2dWp4Z2R3Z3ZydW5qdmhzZWV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTYxNjQ5MSwiZXhwIjoyMDg1MTkyNDkxfQ.UZ1QMrVauKV5uKd509BzA2UoQ5Vexg11i7H9-ktMOdw';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('Setting up Kai Voice database...\n');

  // We can't run raw SQL via the JS client, so we need to use the SQL Editor
  // or the Supabase CLI. This script will test the connection and provide instructions.

  console.log('Database URL:', supabaseUrl);
  console.log('');
  console.log('='.repeat(60));
  console.log('MANUAL STEP REQUIRED');
  console.log('='.repeat(60));
  console.log('');
  console.log('Please run the SQL in scripts/setup-database.sql');
  console.log('');
  console.log('Option 1: Supabase Dashboard');
  console.log('  1. Go to: https://supabase.com/dashboard/project/tvujxgdwgvrunjvhseey/sql');
  console.log('  2. Copy/paste the contents of scripts/setup-database.sql');
  console.log('  3. Click "Run"');
  console.log('');
  console.log('Option 2: Supabase CLI');
  console.log('  supabase db push --db-url postgresql://postgres:[password]@db.tvujxgdwgvrunjvhseey.supabase.co:5432/postgres');
  console.log('');
  console.log('='.repeat(60));
  console.log('');

  // Test connection by trying to select from a table
  const { data, error } = await supabase.from('context').select('id').limit(1);

  if (error && error.code === 'PGRST205') {
    console.log('❌ Tables not yet created. Please run the SQL above.');
  } else if (error) {
    console.log('❌ Connection error:', error.message);
  } else {
    console.log('✅ Database tables exist and connection works!');
    console.log('   Found', data?.length || 0, 'records in context table');
  }
}

setupDatabase().catch(console.error);
