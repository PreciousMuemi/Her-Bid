-- Add missing columns to users table for Her-Bid functionality
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS location TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS skills JSONB NOT NULL DEFAULT '[]',
ADD COLUMN IF NOT EXISTS capacity TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS capacity_numeric INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS reputation_score DECIMAL(3,1) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS phone TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS completed_projects JSONB NOT NULL DEFAULT '[]',
ADD COLUMN IF NOT EXISTS total_earnings INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS projects_completed INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS specialization TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update the existing user record with some demo data
UPDATE users 
SET 
  location = 'Nairobi, Kenya',
  skills = '["Web Development", "Python", "React"]',
  capacity = 'Part-time',
  capacity_numeric = 20,
  reputation_score = 4.5,
  phone = '+254700000000',
  specialization = 'Software Developer',
  created_at = NOW(),
  updated_at = NOW()
WHERE id IS NOT NULL;

-- Create the other required tables if they don't exist
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

-- Enable RLS for new tables
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestone_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for new tables
CREATE POLICY IF NOT EXISTS "Allow all operations on project_milestones" ON project_milestones FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations on milestone_payments" ON milestone_payments FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations on escrow_details" ON escrow_details FOR ALL USING (true);
CREATE POLICY IF NOT EXISTS "Allow all operations on sms_logs" ON sms_logs FOR ALL USING (true);
