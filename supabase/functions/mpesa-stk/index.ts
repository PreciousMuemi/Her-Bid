import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phone_number, amount, order_id } = await req.json()

    // For demo purposes, simulate M-Pesa STK push
    const mockResponse = {
      success: true,
      message: 'STK push sent successfully (Demo Mode)',
      checkout_request_id: `ws_CO_${Date.now()}`,
      merchant_request_id: `${Math.random().toString(36).substr(2, 9)}`,
      response_code: "0",
      response_description: "Success. Request accepted for processing",
      customer_message: "Success. Request accepted for processing"
    }

    // In production, you would integrate with actual M-Pesa API here
    console.log('Demo STK Push:', { phone_number, amount, order_id })

    return new Response(
      JSON.stringify(mockResponse),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('STK Push error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})