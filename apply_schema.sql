-- Gige-Bid Database Schema for Supabase

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
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  percentage INTEGER NOT NULL CHECK (percentage > 0 AND percentage <= 100),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  amount INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE,
  confirmed_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Milestone payments table
CREATE TABLE IF NOT EXISTS milestone_payments (
  id SERIAL PRIMARY KEY,
  milestone_id INTEGER NOT NULL REFERENCES project_milestones(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent_to_mpesa', 'completed', 'failed')),
  transaction_id TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Escrow details table
CREATE TABLE IF NOT EXISTS escrow_details (
  id SERIAL PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  checkout_request_id TEXT,
  mpesa_receipt_number TEXT,
  amount INTEGER NOT NULL,
  phone_number TEXT NOT NULL,
  secured_at TIMESTAMP WITH TIME ZONE,
  paybill_number TEXT,
  account_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- M-Pesa transactions table
CREATE TABLE IF NOT EXISTS mpesa_transactions (
  id SERIAL PRIMARY KEY,
  checkout_request_id TEXT UNIQUE NOT NULL,
  merchant_request_id TEXT NOT NULL,
  order_id TEXT,
  account_reference TEXT,
  phone_number TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  mpesa_receipt_number TEXT,
  transaction_date BIGINT,
  result_code INTEGER,
  result_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SMS logs table
CREATE TABLE IF NOT EXISTS sms_logs (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  phone_number TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT DEFAULT 'general',
  status TEXT,
  message_id TEXT,
  cost TEXT,
  delivery_status TEXT,
  network_code TEXT,
  failure_reason TEXT,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_specialization ON users(specialization);
CREATE INDEX IF NOT EXISTS idx_users_location ON users(location);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_project_milestones_project_id ON project_milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_milestone_payments_milestone_id ON milestone_payments(milestone_id);
CREATE INDEX IF NOT EXISTS idx_escrow_details_project_id ON escrow_details(project_id);
CREATE INDEX IF NOT EXISTS idx_mpesa_transactions_checkout_request_id ON mpesa_transactions(checkout_request_id);
CREATE INDEX IF NOT EXISTS idx_mpesa_transactions_status ON mpesa_transactions(status);
CREATE INDEX IF NOT EXISTS idx_sms_logs_user_id ON sms_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_sms_logs_message_id ON sms_logs(message_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestone_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE mpesa_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_logs ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now - you can restrict later)
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all operations on project_milestones" ON project_milestones FOR ALL USING (true);
CREATE POLICY "Allow all operations on milestone_payments" ON milestone_payments FOR ALL USING (true);
CREATE POLICY "Allow all operations on escrow_details" ON escrow_details FOR ALL USING (true);
CREATE POLICY "Allow all operations on mpesa_transactions" ON mpesa_transactions FOR ALL USING (true);
CREATE POLICY "Allow all operations on sms_logs" ON sms_logs FOR ALL USING (true);

-- Verify tables were created
SELECT 'Tables created successfully!' as status;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'projects', 'project_milestones', 'milestone_payments', 'escrow_details', 'mpesa_transactions', 'sms_logs')
ORDER BY table_name;
