require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

console.log('🔧 Testing Database Connection...');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SERVICE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testConnection() {
  try {
    console.log('Testing table access...');
    
    // Test users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (userError) {
      console.log('❌ Users table error:', userError.message);
    } else {
      console.log('✅ Users table accessible, found', userData?.length || 0, 'records');
    }

    // Test projects table
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .limit(1);
    
    if (projectError) {
      console.log('❌ Projects table error:', projectError.message);
    } else {
      console.log('✅ Projects table accessible, found', projectData?.length || 0, 'records');
    }

    // Test M-Pesa transactions table
    const { data: mpesaData, error: mpesaError } = await supabase
      .from('mpesa_transactions')
      .select('id')
      .limit(1);
    
    if (mpesaError) {
      console.log('❌ M-Pesa transactions table error:', mpesaError.message);
    } else {
      console.log('✅ M-Pesa transactions table accessible, found', mpesaData?.length || 0, 'records');
    }

  } catch (err) {
    console.error('💥 Connection error:', err.message);
  }
}

testConnection();
