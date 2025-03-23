const fs = require('fs');
const path = require('path');

// Read the migration file
const migrationFile = path.resolve(__dirname, '../supabase/migrations/20240701000000_create_scheduled_emails.sql');
const migrationSql = fs.readFileSync(migrationFile, 'utf8');

console.log(`
=====================================================
SUPABASE MIGRATION INSTRUCTIONS
=====================================================

To apply the scheduled_emails table migration, follow these steps:

1. Log in to your Supabase dashboard at https://supabase.com/dashboard/

2. Select your project: fgqrsgupggvtrxmdwotc

3. Navigate to the SQL Editor by clicking on "SQL Editor" in the left sidebar

4. Create a new query by clicking "New Query"

5. Copy and paste the following SQL into the query editor:

${migrationSql}

6. Click "Run" to execute the SQL and create the table

7. Verify the table was created by going to "Table Editor" in the left sidebar
   and checking if "scheduled_emails" appears in the list of tables

=====================================================
AFTER MIGRATION VERIFICATION
=====================================================

To verify the migration was successful, run this query in the SQL Editor:

SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'scheduled_emails'
);

This should return "true" if the table was created successfully.

=====================================================
`);

console.log('Migration instructions generated successfully!'); 