require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

console.log('🔧 Applying Database Schema Updates...');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applySchema() {
  try {
    // Read the SQL file
    const sql = fs.readFileSync('/home/pree/Her-Bid/update_schema.sql', 'utf8');
    
    // Split by semicolons and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    console.log(`📝 Executing ${statements.length} SQL statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (statement) {
        console.log(`${i + 1}/${statements.length}: Executing...`);
        
        try {
          const { data, error } = await supabase.rpc('exec_sql', { 
            sql_query: statement + ';' 
          });
          
          if (error) {
            console.log(`⚠️  Statement ${i + 1} warning:`, error.message);
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (err) {
          console.log(`❌ Statement ${i + 1} error:`, err.message);
        }
      }
    }
    
    // Test the updated structure
    console.log('\n🔍 Testing updated structure...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (userError) {
      console.log('❌ Users test error:', userError.message);
    } else {
      console.log('✅ Updated users table structure:', Object.keys(userData[0] || {}));
    }

  } catch (err) {
    console.error('💥 Error:', err.message);
  }
}

applySchema();
