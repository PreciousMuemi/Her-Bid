import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kydqdeznecttpdaiueob.supabase.co';

// Force the working service role key temporarily
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5ZHFkZXpuZWN0dHBkYWl1ZW9iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjMyOTgwNSwiZXhwIjoyMDcxOTA1ODA1fQ.2G2dMRed069e6HmfnUxi4M5bqv9Dqig3dFzVS-UzRWM';

console.log('🔧 Frontend Supabase Configuration:');
console.log('URL:', supabaseUrl);
console.log('Key exists:', !!supabaseKey);
console.log('Key length:', supabaseKey?.length || 0);
console.log('Key type:', supabaseKey?.includes('service_role') ? 'service_role' : 'anon');
console.log('🔄 Using hardcoded service role key for testing');

// Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'gigebid-frontend'
    }
  }
});

console.log('✅ Frontend Supabase client created');

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
  updated_at?: string;
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
  updated_at?: string;
}

export interface Partnership {
  id: string;
  contract_id: string;
  business_ids: string[];
  status: string;
  compatibility_score: number;
  created_at: string;
  updated_at?: string;
}

export interface Profile {
  id: string;
  user_id?: string;
  business_id?: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface Skill {
  id: number;
  name: string;
  category?: string;
  description?: string;
  created_at: string;
}

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (err) {
    console.error('Supabase connection failed:', err);
    return { success: false, error: err.message };
  }
};

export const testEnvironmentVariables = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('🔍 Environment Variables Test:');
  console.log('VITE_SUPABASE_URL:', url);
  console.log('VITE_SUPABASE_ANON_KEY:', key);
  console.log('Key length:', key?.length);
  console.log('Key starts with eyJ:', key?.startsWith('eyJ'));
  console.log('URL includes supabase.co:', url?.includes('supabase.co'));
  
  // Try to decode the JWT to see if it's valid
  if (key) {
    try {
      const parts = key.split('.');
      if (parts.length === 3) {
        const header = JSON.parse(atob(parts[0]));
        const payload = JSON.parse(atob(parts[1]));
        console.log('JWT Header:', header);
        console.log('JWT Payload:', payload);
        console.log('Role in payload:', payload.role);
        console.log('Project ref:', payload.ref);
        
        // Check for the typo
        if (payload.rose && !payload.role) {
          console.error('❌ FOUND THE BUG: JWT has "rose" instead of "role"!');
          return {
            valid: false,
            error: 'JWT token has "rose" instead of "role" - this is the bug!',
            hasTypo: true,
            payload
          };
        }
        
        return {
          valid: true,
          role: payload.role,
          ref: payload.ref,
          exp: new Date(payload.exp * 1000)
        };
      }
    } catch (e) {
      console.error('Failed to decode JWT:', e);
      return { valid: false, error: 'Invalid JWT format' };
    }
  }
  
  return { valid: false, error: 'No key provided' };
};

export const createTestSupabaseClient = async () => {
  // Fixed test client creation for ES modules
  const testUrl = 'https://kydqdeznecttpdaiueob.supabase.co';
  // Use the corrected service role key
  const testKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5ZHFkZXpuZWN0dHBkYWl1ZW9iIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjMyOTgwNSwiZXhwIjoyMDcxOTA1ODA1fQ.2G2dMRed069e6HmfnUxi4M5bqv9Dqig3dFzVS-UzRWM';
  
  console.log('🧪 Creating test Supabase client...');
  
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const testClient = createClient(testUrl, testKey);
    
    return testClient;
  } catch (error) {
    console.error('Failed to create test client:', error);
    return null;
  }
};

export default supabase;
