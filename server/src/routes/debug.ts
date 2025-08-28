import express, { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

router.get('/test-keys', async (req: Request, res: Response) => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.SUPABASE_ANON_KEY;

    console.log('🔍 Key Debug Info:');
    console.log('URL:', !!supabaseUrl);
    console.log('Service Key Length:', serviceKey?.length || 0);
    console.log('Anon Key Length:', anonKey?.length || 0);
    console.log('Service Key Prefix:', serviceKey?.substring(0, 20));

    if (!supabaseUrl || !serviceKey) {
      return res.status(400).json({
        error: 'Missing environment variables',
        has_url: !!supabaseUrl,
        has_service_key: !!serviceKey,
        has_anon_key: !!anonKey
      });
    }

    // Test with service role key
    const supabase = createClient(supabaseUrl, serviceKey);
    
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      return res.status(400).json({
        error: 'Supabase connection failed',
        supabase_error: error,
        url: supabaseUrl,
        key_length: serviceKey.length
      });
    }

    res.json({
      success: true,
      connection: 'working',
      url: supabaseUrl,
      key_length: serviceKey.length,
      test_result: data
    });

  } catch (error) {
    res.status(500).json({
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;