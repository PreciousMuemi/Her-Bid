require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

console.log('🔧 Checking Database Schema...');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
  try {
    // Check users table structure
    console.log('📊 Checking users table structure...');
    const { data: columns, error } = await supabase
      .rpc('get_table_columns', { table_name: 'users' });
    
    if (error) {
      console.log('❌ Error getting columns:', error.message);
      
      // Try a different approach
      const { data, error: selectError } = await supabase
        .from('users')
        .select('*')
        .limit(1);
        
      if (selectError) {
        console.log('❌ Users table error:', selectError.message);
      } else {
        console.log('✅ Users table accessible, sample data keys:', Object.keys(data[0] || {}));
      }
    } else {
      console.log('✅ Users table columns:', columns);
    }

  } catch (err) {
    console.error('💥 Error:', err.message);
  }
}

checkSchema();
