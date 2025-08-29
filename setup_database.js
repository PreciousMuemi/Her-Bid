import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const createTablesSQL = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  skills JSONB NOT NULL DEFAULT '[]',
  capacity TEXT NOT NULL,
  capacity_numeric INTEGER NOT NULL,
  reputation_score DECIMAL(3,1) NOT NULL DEFAULT 0,
  phone TEXT NOT NULL,
  completed_projects JSONB NOT NULL DEFAULT '[]',
  total_earnings INTEGER NOT NULL DEFAULT 0,
  projects_completed INTEGER NOT NULL DEFAULT 0,
  specialization TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  budget INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  funds_status TEXT NOT NULL DEFAULT 'pending' CHECK (funds_status IN ('pending', 'secured', 'partially_disbursed', 'fully_disbursed')),
  team_members JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deadline TIMESTAMP WITH TIME ZONE
);

-- Project milestones table
CREATE TABLE IF NOT EXISTS project_milestones (
  id SERIAL PRIMARY KEY,
  project_id TEXT NOT NULL,
  description TEXT NOT NULL,
  percentage INTEGER NOT NULL CHECK (percentage > 0 AND percentage <= 100),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  amount INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  confirmed_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Escrow details table
CREATE TABLE IF NOT EXISTS escrow_details (
  id SERIAL PRIMARY KEY,
  project_id TEXT NOT NULL,
  checkout_request_id TEXT,
  mpesa_receipt_number TEXT,
  amount INTEGER NOT NULL,
  phone_number TEXT NOT NULL,
  secured_at TIMESTAMP WITH TIME ZONE,
  paybill_number TEXT,
  account_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security and create basic policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_details ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all operations on users" ON users;
DROP POLICY IF EXISTS "Allow all operations on projects" ON projects;
DROP POLICY IF EXISTS "Allow all operations on project_milestones" ON project_milestones;
DROP POLICY IF EXISTS "Allow all operations on escrow_details" ON escrow_details;

CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all operations on project_milestones" ON project_milestones FOR ALL USING (true);
CREATE POLICY "Allow all operations on escrow_details" ON escrow_details FOR ALL USING (true);
`;

async function setupDatabase() {
  console.log('🗄️  Setting up Her-Bid database schema...');
  
  try {
    const { error } = await supabase.rpc('exec', { sql: createTablesSQL });
    
    if (error) {
      console.error('❌ Error creating tables:', error);
      throw error;
    }
    
    console.log('✅ Database tables created successfully!');
    
    // Verify tables exist
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['users', 'projects', 'project_milestones', 'escrow_details']);
    
    if (tablesError) {
      console.error('❌ Error verifying tables:', tablesError);
    } else {
      console.log('📊 Verified tables:', tables?.map(t => t.table_name).sort());
    }
    
    // Insert some demo users
    console.log('👥 Creating demo users...');
    const demoUsers = [
      {
        id: 'user_001',
        name: 'Alice Wanjiku',
        location: 'Nairobi',
        skills: '["Logistics", "Supply Chain"]',
        capacity: 'Medium (5-8 orders)',
        capacity_numeric: 6,
        reputation_score: 9.2,
        phone: '+254701234567',
        specialization: 'Logistics'
      },
      {
        id: 'user_002', 
        name: 'David Kimani',
        location: 'Kibera',
        skills: '["Egg Supply", "Quality Control"]',
        capacity: 'High (10+ orders)',
        capacity_numeric: 12,
        reputation_score: 8.8,
        phone: '+254712345678',
        specialization: 'Egg Supply'
      }
    ];
    
    for (const user of demoUsers) {
      const { error: userError } = await supabase.from('users').upsert(user);
      if (userError) {
        console.log(`⚠️  Note: Could not insert user ${user.name}:`, userError.message);
      } else {
        console.log(`✅ Created demo user: ${user.name}`);
      }
    }
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('📈 You can view your data at: https://supabase.com/dashboard/project/kydqdeznecttpdaiueob/editor');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
