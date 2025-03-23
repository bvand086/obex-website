const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Get the Supabase URL and key from environment or .env file
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// Replace this with the actual Supabase URL from your project
const supabaseUrl = "https://fgqrsgupggvtrxmdwotc.supabase.co";
// Use the proper service role key from .env.local
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZncXJzZ3VwZ2d2dHJ4bWR3b3RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTI2NTg2NCwiZXhwIjoyMDUwODQxODY0fQ.tAnFiNJPd4M_JMVbnQd2kwUX4vkR-U-dC2yqmFs7li8";

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL and/or key not found.');
  process.exit(1);
}

console.log(`Using Supabase URL: ${supabaseUrl}`);
console.log(`Using Supabase key: ${supabaseKey.substring(0, 5)}...`);

const supabase = createClient(supabaseUrl, supabaseKey);

// Read the migration file
const migrationFile = path.resolve(__dirname, '../supabase/migrations/20240701000000_create_scheduled_emails.sql');
const migrationSql = fs.readFileSync(migrationFile, 'utf8');
console.log(`Migration file read: ${migrationFile}`);

// Alternative approach: output the SQL to be run manually in the Supabase SQL Editor
console.log('\n=====================================================');
console.log('MIGRATION SQL TO RUN IN THE SUPABASE SQL EDITOR:');
console.log('=====================================================\n');
console.log(migrationSql);
console.log('\n=====================================================');
console.log('Copy the SQL above and run it in the Supabase SQL Editor');
console.log('Go to https://supabase.com/dashboard/project/_/sql');
console.log('=====================================================\n'); 