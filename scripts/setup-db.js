// Run this script to set up the Supabase database tables
// Usage: node scripts/setup-db.js
//
// Requires environment variables:
//   SUPABASE_URL - Your Supabase project URL
//   SUPABASE_SERVICE_ROLE_KEY - Service role key (from Supabase Dashboard > Settings > API)

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('  SUPABASE_URL');
  console.error('  SUPABASE_SERVICE_ROLE_KEY');
  console.error('');
  console.error('Set them before running this script:');
  console.error('  SUPABASE_URL=https://your-project.supabase.co SUPABASE_SERVICE_ROLE_KEY=your-key node scripts/setup-db.js');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('Setting up Kai Voice database...\n');
  console.log('Database URL:', supabaseUrl);
  console.log('');
  console.log('='.repeat(60));
  console.log('MANUAL STEP REQUIRED');
  console.log('='.repeat(60));
  console.log('');
  console.log('Please run the SQL in scripts/setup-database.sql');
  console.log('in your Supabase Dashboard SQL Editor.');
  console.log('');

  // Test connection by trying to select from a table
  const { data, error } = await supabase.from('context').select('id').limit(1);

  if (error && error.code === 'PGRST205') {
    console.log('Tables not yet created. Please run the SQL above.');
  } else if (error) {
    console.log('Connection error:', error.message);
  } else {
    console.log('Database tables exist and connection works!');
    console.log('   Found', data?.length || 0, 'records in context table');
  }
}

setupDatabase().catch(console.error);
