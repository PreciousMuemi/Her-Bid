import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '../../lib/supabase';

const DatabaseDebug = () => {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [tableStatus, setTableStatus] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);

  // Add environment check directly in the component
  const checkEnvironment = () => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    console.log('🔍 Environment Variables:');
    console.log('URL:', url);
    console.log('Key exists:', !!key);
    console.log('Key length:', key?.length);
    
    return { url, key, hasUrl: !!url, hasKey: !!key };
  };

  const testConnection = async () => {
    setLoading(true);
    const env = checkEnvironment();
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      if (error) {
        setConnectionStatus({
          success: false,
          error: error.message,
          env
        });
      } else {
        setConnectionStatus({
          success: true,
          data,
          message: 'Connected successfully!',
          env
        });
      }
      
    } catch (err) {
      setConnectionStatus({
        success: false,
        error: err.message,
        env
      });
    }
    
    setLoading(false);
  };

  const checkAllTables = async () => {
    setLoading(true);
    try {
      const tables = ['profiles', 'businesses', 'contracts', 'partnerships', 'skills'];
      const results = {};
      
      for (const table of tables) {
        try {
          console.log(`Testing table: ${table}`);
          const { data, error } = await supabase.from(table).select('*').limit(1);
          results[table] = { 
            exists: !error, 
            error: error?.message,
            details: error?.details || null
          };
        } catch (err) {
          results[table] = { exists: false, error: err.message, type: 'exception' };
        }
      }
      
      setTableStatus(results);
    } catch (err) {
      console.error('Table check failed:', err);
      setTableStatus({ error: err.message });
    }
    setLoading(false);
  };

  const setupDatabase = async () => {
    setLoading(true);
    console.log('🚀 Setting up GigeBid Database...');

    try {
      const sampleBusiness = {
        id: 'biz-test-001',
        name: 'Tech Solutions Pro',
        owner_name: 'Alex Johnson',
        industry: 'Technology',
        location: 'Nairobi',
        description: 'Professional web development services',
        skills: ['Web Development', 'UI/UX Design'],
        reputation_score: 4.8,
        created_at: new Date().toISOString()
      };
      
      console.log('Attempting to insert test business...');
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .upsert([sampleBusiness])
        .select();
      
      if (businessError) {
        console.error('Business insert error:', businessError);
        setDebugInfo({ 
          success: false, 
          error: businessError.message,
          code: businessError.code,
          suggestion: 'You may need to create the tables manually in Supabase SQL editor'
        });
      } else {
        console.log('✅ Business inserted successfully!');
        setDebugInfo({ 
          success: true, 
          message: 'Database setup successful!',
          data: businessData
        });
      }
      
      await fetchData();
      
    } catch (error) {
      console.error('💥 Database setup failed:', error);
      setDebugInfo({ 
        success: false, 
        error: error.message,
        type: 'setup_error'
      });
    }
    
    setLoading(false);
  };

  const fetchData = async () => {
    try {
      console.log('Fetching existing data...');
      
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .limit(10);

      if (!businessError && businessData) {
        setBusinesses(businessData);
        console.log('Businesses loaded:', businessData.length);
      }

      const { data: contractData, error: contractError } = await supabase
        .from('contracts')
        .select('*')
        .limit(10);

      if (!contractError && contractData) {
        setContracts(contractData);
        console.log('Contracts loaded:', contractData.length);
      }
      
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Environment check display */}
      <Card>
        <CardHeader>
          <CardTitle>🔧 Environment Check</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>URL: {import.meta.env.VITE_SUPABASE_URL || 'NOT FOUND'}</div>
            <div>Key Length: {import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 'NOT FOUND'}</div>
            <div>Key Preview: {import.meta.env.VITE_SUPABASE_ANON_KEY ? import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 50) + '...' : 'NOT FOUND'}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>🔍 GigeBid Database Debug Panel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="flex gap-4 flex-wrap">
            <Button onClick={testConnection} disabled={loading}>
              {loading ? 'Testing...' : 'Test Connection'}
            </Button>
          </div>

          {connectionStatus && (
            <Alert>
              <AlertDescription>
                <div>
                  <strong>Connection:</strong> {connectionStatus.success ? '✅ Connected' : '❌ Failed'}
                </div>
                {connectionStatus.message && (
                  <div className="mt-1 text-green-600">{connectionStatus.message}</div>
                )}
                {connectionStatus.error && (
                  <div className="mt-2 text-red-600">
                    <strong>Error:</strong> {connectionStatus.error}
                  </div>
                )}
                {connectionStatus.env && (
                  <details className="mt-2">
                    <summary>Environment Details</summary>
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">
                      {JSON.stringify(connectionStatus.env, null, 2)}
                    </pre>
                  </details>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseDebug;