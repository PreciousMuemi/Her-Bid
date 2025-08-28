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

export const createTestSupabaseClient = () => {
  // Test with hardcoded values first
  const testUrl = 'https://kydqdeznecttpdaiueob.supabase.co';
  const testKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5ZHFkZXpuZWN0dHBkYWl1ZW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMjk4MDUsImV4cCI6MjA3MTkwNTgwNX0.LejTPKQ9g1hQxX-ZQfKE589O4yEHs5154LoMvlBEQzk';
  
  console.log('🧪 Creating test Supabase client with hardcoded values...');
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    const testClient = createClient(testUrl, testKey);
    
    return testClient;
  } catch (error) {
    console.error('Failed to create test client:', error);
    return null;
  }
};