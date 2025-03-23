const fs = require('fs');
const path = require('path');
const https = require('https');

// Read the migration file
const migrationFile = path.resolve(__dirname, '../supabase/migrations/20240701000000_create_scheduled_emails.sql');
const migrationSql = fs.readFileSync(migrationFile, 'utf8');

// Supabase project details
const supabaseUrl = 'https://fgqrsgupggvtrxmdwotc.supabase.co';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZncXJzZ3VwZ2d2dHJ4bWR3b3RjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTI2NTg2NCwiZXhwIjoyMDUwODQxODY0fQ.tAnFiNJPd4M_JMVbnQd2kwUX4vkR-U-dC2yqmFs7li8';

// Function to make a POST request to the SQL API
function executeSql(sql) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`
      }
    };

    // Construct the URL for the REST SQL endpoint
    const url = `${supabaseUrl}/rest/v1/rpc/pg_execute`;
    
    const req = https.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('SQL executed successfully.');
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(data);
          }
        } else {
          console.error(`Request failed with status: ${res.statusCode}`);
          console.error('Response body:', data);
          reject(new Error(`Request failed: ${res.statusCode} - ${data}`));
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('Error making request:', error);
      reject(error);
    });
    
    // Send the SQL to execute
    req.write(JSON.stringify({ query: sql }));
    req.end();
  });
}

// Split the SQL into individual statements
const statements = migrationSql
  .split(';')
  .map(stmt => stmt.trim())
  .filter(stmt => stmt.length > 0);

// Execute each statement in sequence
async function applyMigration() {
  console.log(`Found ${statements.length} SQL statements to execute.`);
  
  for (let i = 0; i < statements.length; i++) {
    console.log(`Executing statement ${i + 1}/${statements.length}...`);
    
    try {
      await executeSql(statements[i]);
      console.log(`Statement ${i + 1} executed successfully.`);
    } catch (error) {
      console.error(`Failed to execute statement ${i + 1}:`, error.message);
      console.error('Statement:', statements[i]);
      // Continue with next statement
    }
  }
  
  console.log('Migration complete. Check your Supabase database to confirm changes.');
}

applyMigration().catch(error => {
  console.error('Migration failed:', error);
  process.exit(1);
}); 