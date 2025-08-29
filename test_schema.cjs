require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

console.log('🔧 Applying Database Schema Updates (Direct Approach)...');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateUsersTable() {
  try {
    console.log('📝 Adding missing columns to users table...');
    
    // Since we can't execute raw SQL directly, let's try using SQL Editor approach
    // For now, let's test if we can update the existing user with the expected structure
    
    // First, let's check what's in the table
    const { data: existingUsers, error: fetchError } = await supabase
      .from('users')
      .select('*');
    
    if (fetchError) {
      console.log('❌ Error fetching users:', fetchError.message);
      return;
    }
    
    console.log('📊 Current users data:', existingUsers);
    
    // Try to create a new user with all the required fields to test the structure
    console.log('🧪 Testing table structure by attempting insert...');
    
    const testUser = {
      id: 'test_user_schema_check',
      email: 'test@example.com',
      name: 'Test User',
      location: 'Nairobi, Kenya',
      skills: ['Web Development', 'Python'],
      capacity: 'Part-time',
      capacity_numeric: 20,
      reputation_score: 4.5,
      phone: '+254700000000',
      completed_projects: [],
      total_earnings: 0,
      projects_completed: 0,
      specialization: 'Software Developer'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert([testUser])
      .select();
    
    if (insertError) {
      console.log('❌ Insert test failed (expected - table needs schema update):', insertError.message);
      console.log('📋 This confirms we need to manually update the schema in Supabase dashboard');
    } else {
      console.log('✅ Insert test successful! Schema is already correct:', insertData);
    }

  } catch (err) {
    console.error('💥 Error:', err.message);
  }
}

updateUsersTable();
