import { supabase } from '@/lib/supabase';

export const testDatabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase.from('profiles').select('count');
    
    if (error) {
      console.error('Database connection error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Database connection successful!');
    return { success: true, data };
    
  } catch (err) {
    console.error('Connection test failed:', err);
    return { success: false, error: err };
  }
};

export const checkTables = async () => {
  try {
    // Check if core tables exist
    const tables = ['profiles', 'businesses', 'contracts', 'partnerships', 'skills'];
    const results = {};
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        results[table] = { exists: !error, error: error?.message };
      } catch (err) {
        results[table] = { exists: false, error: err.message };
      }
    }
    
    return results;
  } catch (err) {
    console.error('Table check failed:', err);
    return { error: err.message };
  }
};