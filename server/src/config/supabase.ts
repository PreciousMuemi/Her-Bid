import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try multiple paths for the .env file
const possibleEnvPaths = [
  path.resolve(__dirname, '../../../.env'),    // from server/src/config to root
  path.resolve(__dirname, '../../.env'),       // from server/src to root  
  path.resolve(process.cwd(), '.env'),         // from current working directory
  path.resolve(__dirname, '../.env'),          // from server/src to server
];

let envLoaded = false;
for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    console.log(`📁 Found .env file at: ${envPath}`);
    dotenv.config({ path: envPath });
    envLoaded = true;
    break;
  } else {
    console.log(`❌ No .env file at: ${envPath}`);
  }
}

if (!envLoaded) {
  console.log('⚠️  No .env file found, using fallback values...');
}

// Debug all environment variables
console.log('🔍 Environment Debug:');
console.log('Current working directory:', process.cwd());
console.log('__dirname:', __dirname);
console.log('All SUPABASE env vars:', Object.keys(process.env).filter(key => key.includes('SUPABASE')));

// Get environment variables with multiple fallbacks
const supabaseUrl = process.env.SUPABASE_URL || 
                   process.env.VITE_SUPABASE_URL || 
                   'https://kydqdeznecttpdaiueob.supabase.co';

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 
                          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5ZHFkZXpuZWN0dHBkYWl1ZW9iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjMyOTgwNSwiZXhwIjoyMDcxOTA1ODA1fQ.2G2dMRed069e6HmfnUxi4M5bqv9Dqig3dFzVS-UzRWM';

console.log('🔧 Server Supabase Configuration:');
console.log('URL:', supabaseUrl);
console.log('Service Key exists:', !!supabaseServiceKey);
console.log('Service Key length:', supabaseServiceKey?.length || 0);
console.log('Using fallback values:', !process.env.SUPABASE_URL);

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'gigebid-server'
    }
  }
});

console.log('✅ Supabase client created successfully');

// Export both named and default
export { supabase };
export default supabase;

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    console.log('🧪 Testing server Supabase connection...');
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Server Supabase connection error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Server Supabase connection successful');
    return { success: true, data };
  } catch (err) {
    console.error('❌ Server Supabase connection failed:', err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return { success: false, error: errorMessage };
  }
};

// Database types for TypeScript
export interface Business {
  id: string;
  name: string;
  owner_name: string;
  industry: string;
  location: string;
  description: string;
  skills: string[];
  reputation_score: number;
  created_at: string;
}

export interface Contract {
  id: string;
  title: string;
  description: string;
  required_skills: string[];
  budget: number;
  deadline: string;
  status: string;
  client_name: string;
  created_at: string;
}

export interface Partnership {
  id: string;
  contract_id: string;
  business_ids: string[];
  status: string;
  compatibility_score: number;
  created_at: string;
}