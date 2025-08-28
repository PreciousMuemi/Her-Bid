import { supabase } from '@/lib/supabase';

export const debugSupabaseConnection = async () => {
  console.log('🔍 Debugging Supabase Connection...');
  
  // Check if we can connect to Supabase
  try {
    console.log('Testing basic connection...');
    const { data, error, status, statusText } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    console.log('Response status:', status);
    console.log('Response statusText:', statusText);
    console.log('Response data:', data);
    console.log('Response error:', error);
    
    if (error) {
      // Try different approaches
      console.log('Trying alternative connection methods...');
      
      // Try with a simple table that might exist
      const { data: authData, error: authError } = await supabase.auth.getSession();
      console.log('Auth session check:', { authData, authError });
      
      // Try to get the current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      console.log('User check:', { userData, userError });
      
      return { 
        success: false, 
        error: error.message,
        details: {
          status,
          statusText,
          originalError: error,
          authCheck: { authData, authError },
          userCheck: { userData, userError }
        }
      };
    }
    
    return { success: true, data };
    
  } catch (err) {
    console.error('Connection failed with exception:', err);
    return { 
      success: false, 
      error: err.message,
      type: 'exception'
    };
  }
};

export const createTestTable = async () => {
  console.log('🚀 Attempting to create test table...');
  
  try {
    // Try to create a simple test table
    const { data, error } = await supabase
      .from('test_table')
      .select('*')
      .limit(1);
    
    if (error && error.message.includes('does not exist')) {
      console.log('Test table does not exist, this is expected for first run');
      return { 
        success: true, 
        message: 'Ready to create tables',
        needsSetup: true 
      };
    }
    
    if (error) {
      return {
        success: false,
        error: error.message,
        suggestion: 'Check if the Supabase project is properly configured'
      };
    }
    
    return { success: true, data };
    
  } catch (err) {
    console.error('Test table creation failed:', err);
    return { success: false, error: err.message };
  }
};

export const testSupabaseEnvironment = () => {
  console.log('🔧 Testing Environment Variables...');
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('VITE_SUPABASE_URL:', supabaseUrl);
  console.log('VITE_SUPABASE_ANON_KEY exists:', !!supabaseAnonKey);
  console.log('VITE_SUPABASE_ANON_KEY length:', supabaseAnonKey?.length || 0);
  
  return {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    urlValid: supabaseUrl?.includes('supabase.co'),
    keyValid: supabaseAnonKey?.length > 100
  };
};

export const createDatabaseTables = async () => {
  console.log('🏗️ Creating database tables...');
  
  // SQL to create tables - this would normally be run in Supabase SQL editor
  const createBusinessesTable = `
    CREATE TABLE IF NOT EXISTS businesses (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      owner_name TEXT NOT NULL,
      industry TEXT,
      location TEXT,
      description TEXT,
      skills TEXT[],
      reputation_score DECIMAL(3,2) DEFAULT 0.0,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  
  const createContractsTable = `
    CREATE TABLE IF NOT EXISTS contracts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      required_skills TEXT[],
      budget INTEGER,
      deadline TIMESTAMPTZ,
      status TEXT DEFAULT 'open',
      client_name TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  
  const createPartnershipsTable = `
    CREATE TABLE IF NOT EXISTS partnerships (
      id TEXT PRIMARY KEY,
      contract_id TEXT REFERENCES contracts(id),
      business_ids TEXT[],
      status TEXT DEFAULT 'pending',
      compatibility_score DECIMAL(5,2),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  
  const createSkillsTable = `
    CREATE TABLE IF NOT EXISTS skills (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      category TEXT,
      description TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  
  const createProfilesTable = `
    CREATE TABLE IF NOT EXISTS profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id),
      business_id TEXT REFERENCES businesses(id),
      display_name TEXT,
      bio TEXT,
      avatar_url TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  
  // Note: These SQL commands need to be run in Supabase SQL editor
  // For now, we'll return the SQL for manual execution
  return {
    success: false,
    message: 'Tables need to be created manually in Supabase SQL editor',
    sql: {
      businesses: createBusinessesTable,
      contracts: createContractsTable,
      partnerships: createPartnershipsTable,
      skills: createSkillsTable,
      profiles: createProfilesTable
    }
  };
};

export const insertSampleData = async () => {
  console.log('📊 Inserting sample data...');
  
  try {
    // Sample businesses (gender-neutral)
    const businesses = [
      {
        id: 'biz-001',
        name: 'Digital Solutions Pro',
        owner_name: 'Alex Johnson',
        industry: 'Technology',
        location: 'Nairobi',
        description: 'Professional web development and digital marketing services',
        skills: ['Web Development', 'Digital Marketing', 'SEO'],
        reputation_score: 4.8,
        created_at: new Date().toISOString()
      },
      {
        id: 'biz-002', 
        name: 'Creative Design Studio',
        owner_name: 'Jordan Smith',
        industry: 'Design',
        location: 'Nairobi',
        description: 'UI/UX design and branding specialists',
        skills: ['UI/UX Design', 'Graphic Design', 'Branding'],
        reputation_score: 4.6,
        created_at: new Date().toISOString()
      },
      {
        id: 'biz-003',
        name: 'Finance Analytics Hub',
        owner_name: 'Taylor Brown',
        industry: 'Finance',
        location: 'Mombasa',
        description: 'Financial consulting and analytics services',
        skills: ['Financial Analysis', 'Data Analytics', 'Consulting'],
        reputation_score: 4.9,
        created_at: new Date().toISOString()
      }
    ];

    // Sample contracts
    const contracts = [
      {
        id: 'contract-001',
        title: 'Government Digital Platform',
        description: 'Build a comprehensive digital platform for government services',
        required_skills: ['Web Development', 'UI/UX Design', 'Security'],
        budget: 2500000,
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'open',
        client_name: 'Kenya Government',
        created_at: new Date().toISOString()
      },
      {
        id: 'contract-002',
        title: 'Mobile Banking App',
        description: 'Develop a secure mobile banking application',
        required_skills: ['Mobile Development', 'Financial Analysis', 'Security'],
        budget: 3000000,
        deadline: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'open',
        client_name: 'Commercial Bank of Kenya',
        created_at: new Date().toISOString()
      }
    ];

    // Insert businesses
    const { data: businessData, error: businessError } = await supabase
      .from('businesses')
      .upsert(businesses)
      .select();

    if (businessError) {
      console.error('❌ Error inserting businesses:', businessError);
      return {
        success: false,
        error: businessError.message,
        suggestion: 'Make sure the businesses table exists'
      };
    }

    // Insert contracts
    const { data: contractData, error: contractError } = await supabase
      .from('contracts')
      .upsert(contracts)
      .select();

    if (contractError) {
      console.error('❌ Error inserting contracts:', contractError);
      return {
        success: false,
        error: contractError.message,
        suggestion: 'Make sure the contracts table exists'
      };
    }

    console.log('✅ Sample data inserted successfully!');
    return {
      success: true,
      data: {
        businesses: businessData,
        contracts: contractData
      }
    };

  } catch (error) {
    console.error('💥 Sample data insertion failed:', error);
    return {
      success: false,
      error: error.message,
      type: 'insert_error'
    };
  }
};