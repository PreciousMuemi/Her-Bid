import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kydqdeznecttpdaiueob.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5ZHFkZXpuZWN0dHBkYWl1ZW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMjk4MDUsImV4cCI6MjA3MTkwNTgwNX0.LejTPKQ9g1hQxX-ZQfKE589O4yEHs5154LoMvlBEQzk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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