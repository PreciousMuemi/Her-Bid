import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspectDatabase() {
  console.log('🔍 Inspecting Supabase database structure...');
  
  try {
    // Check what tables exist
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('❌ Error fetching tables:', tablesError);
      return;
    }
    
    console.log('📋 Existing tables:', tables?.map(t => t.table_name));
    
    // Try to inspect users table structure
    const { data: userColumns, error: userColumnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_schema', 'public')
      .eq('table_name', 'users');
    
    if (userColumnsError) {
      console.log('📝 Users table structure query error:', userColumnsError.message);
    } else {
      console.log('👥 Users table columns:', userColumns);
    }
    
    // Try to see what data exists in users table (if any)
    const { data: existingUsers, error: usersDataError } = await supabase
      .from('users')
      .select('*')
      .limit(5);
    
    if (usersDataError) {
      console.log('📝 Users data query error:', usersDataError.message);
    } else {
      console.log('👥 Existing users data:', existingUsers);
    }
    
  } catch (error) {
    console.error('❌ Database inspection failed:', error);
  }
}

inspectDatabase();
