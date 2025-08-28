import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { debugSupabaseConnection, createTestTable } from '@/utils/supabaseDebug';

const DatabaseDebug = () => {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [tableStatus, setTableStatus] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);

  const testConnection = async () => {
    setLoading(true);
    console.log('🔍 Starting comprehensive connection test...');
    
    const result = await debugSupabaseConnection();
    setConnectionStatus(result);
    
    // Also test table creation capabilities
    const tableTest = await createTestTable();
    setDebugInfo(tableTest);
    
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
      // First, let's try to create some basic tables if they don't exist
      console.log('Creating businesses table...');
      
      // Note: In a real app, you'd run this SQL in Supabase SQL editor:
      const businessesTableSQL = `
        CREATE TABLE IF NOT EXISTS businesses (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          owner_name TEXT NOT NULL,
          industry TEXT,
          location TEXT,
          description TEXT,
          skills TEXT[],
          reputation_score DECIMAL(3,2) DEFAULT 0.0,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;
      
      const contractsTableSQL = `
        CREATE TABLE IF NOT EXISTS contracts (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          required_skills TEXT[],
          budget INTEGER,
          deadline TIMESTAMPTZ,
          status TEXT DEFAULT 'open',
          client_name TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `;
      
      // For now, let's just try to insert data and see what happens
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
      
      // Fetch businesses
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('*')
        .limit(10);

      if (!businessError && businessData) {
        setBusinesses(businessData);
        console.log('Businesses loaded:', businessData.length);
      }

      // Fetch contracts
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
      <Card>
        <CardHeader>
          <CardTitle>🔍 GigeBid Database Debug Panel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <div className="flex gap-4 flex-wrap">
            <Button onClick={testConnection} disabled={loading}>
              {loading ? 'Testing...' : 'Deep Connection Test'}
            </Button>
            <Button onClick={checkAllTables} disabled={loading}>
              Check Tables
            </Button>
            <Button onClick={setupDatabase} disabled={loading}>
              Setup Database
            </Button>
            <Button onClick={fetchData} disabled={loading}>
              Refresh Data
            </Button>
          </div>

          {connectionStatus && (
            <Alert>
              <AlertDescription>
                <div>
                  <strong>Connection Status:</strong> {connectionStatus.success ? '✅ Connected' : '❌ Failed'}
                </div>
                {connectionStatus.error && (
                  <div className="mt-2">
                    <strong>Error:</strong> {connectionStatus.error}
                  </div>
                )}
                {connectionStatus.details && (
                  <details className="mt-2">
                    <summary>Debug Details</summary>
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">
                      {JSON.stringify(connectionStatus.details, null, 2)}
                    </pre>
                  </details>
                )}
              </AlertDescription>
            </Alert>
          )}

          {debugInfo && (
            <Alert>
              <AlertDescription>
                <div>
                  <strong>Setup Status:</strong> {debugInfo.success ? '✅ Success' : '❌ Failed'}
                </div>
                {debugInfo.message && <div className="mt-1">{debugInfo.message}</div>}
                {debugInfo.error && <div className="mt-1 text-red-600">{debugInfo.error}</div>}
                {debugInfo.suggestion && <div className="mt-1 text-blue-600">{debugInfo.suggestion}</div>}
              </AlertDescription>
            </Alert>
          )}

          {tableStatus && (
            <div>
              <h4 className="font-medium mb-2">Table Status:</h4>
              <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                {JSON.stringify(tableStatus, null, 2)}
              </pre>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Businesses ({businesses.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {businesses.length > 0 ? (
                  <div className="space-y-2">
                    {businesses.slice(0, 3).map((biz) => (
                      <div key={biz.id} className="p-2 bg-blue-50 rounded">
                        <div className="font-medium">{biz.name}</div>
                        <div className="text-sm text-gray-600">
                          Owner: {biz.owner_name} | {biz.location}
                        </div>
                        <div className="text-xs text-gray-500">
                          Skills: {Array.isArray(biz.skills) ? biz.skills.join(', ') : 'N/A'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500">No businesses found</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contracts ({contracts.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {contracts.length > 0 ? (
                  <div className="space-y-2">
                    {contracts.slice(0, 3).map((contract) => (
                      <div key={contract.id} className="p-2 bg-green-50 rounded">
                        <div className="font-medium">{contract.title}</div>
                        <div className="text-sm text-gray-600">
                          Budget: KES {contract.budget?.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          Skills: {Array.isArray(contract.required_skills) ? contract.required_skills.join(', ') : 'N/A'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500">No contracts found</div>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseDebug;