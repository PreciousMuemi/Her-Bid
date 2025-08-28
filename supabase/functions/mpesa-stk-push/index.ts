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
    const { phone_number, amount, order_id, account_reference } = await req.json()

    // Validate inputs
    if (!phone_number || !amount || !order_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: phone_number, amount, order_id' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get M-Pesa credentials from environment
    const consumer_key = Deno.env.get('MPESA_CONSUMER_KEY')
    const consumer_secret = Deno.env.get('MPESA_CONSUMER_SECRET')
    const shortcode = Deno.env.get('MPESA_SHORTCODE')
    const passkey = Deno.env.get('MPESA_PASSKEY')
    const environment = Deno.env.get('MPESA_ENVIRONMENT') || 'sandbox'
    
    // M-Pesa API URLs
    const baseUrl = environment === 'production' 
      ? 'https://api.safaricom.co.ke' 
      : 'https://sandbox.safaricom.co.ke'
    
    const callback_url = `${Deno.env.get('SUPABASE_URL')}/functions/v1/mpesa-callback`

    if (!consumer_key || !consumer_secret || !shortcode || !passkey) {
      return new Response(
        JSON.stringify({ error: 'M-Pesa configuration missing' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Step 1: Get OAuth token from M-Pesa
    const auth = btoa(`${consumer_key}:${consumer_secret}`)
    
    const tokenResponse = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    })

    if (!tokenResponse.ok) {
      throw new Error(`OAuth failed: ${tokenResponse.status} ${tokenResponse.statusText}`)
    }

    const tokenData = await tokenResponse.json()
    
    if (!tokenData.access_token) {
      return new Response(
        JSON.stringify({ error: 'Failed to get M-Pesa access token', details: tokenData }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Step 2: Generate timestamp and password for STK Push
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)
    const password = btoa(`${shortcode}${passkey}${timestamp}`)

    // Step 3: Format phone number (remove leading 0, add 254)
    let formattedPhone = phone_number.toString().replace(/\s+/g, '')
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.slice(1)
    } else if (!formattedPhone.startsWith('254')) {
      formattedPhone = '254' + formattedPhone
    }

    // Step 4: Prepare STK Push payload
    const stkPayload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(parseFloat(amount)),
      PartyA: formattedPhone,
      PartyB: shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: callback_url,
      AccountReference: account_reference || `GigeBid-${order_id}`,
      TransactionDesc: `Payment for GigeBid Order ${order_id}`
    }

    console.log('STK Push Request:', {
      ...stkPayload,
      Password: '[HIDDEN]',
      CallBackURL: callback_url
    })

    // Step 5: Send STK Push request
    const stkResponse = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(stkPayload)
    })

    const stkData = await stkResponse.json()
    console.log('STK Push Response:', stkData)

    // Step 6: Store transaction in database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (stkData.ResponseCode === "0") {
      // Success - store transaction
      const { error } = await supabase
        .from('mpesa_transactions')
        .insert({
          checkout_request_id: stkData.CheckoutRequestID,
          merchant_request_id: stkData.MerchantRequestID,
          order_id: order_id,
          account_reference: account_reference || `GigeBid-${order_id}`,
          phone_number: formattedPhone,
          amount: Math.round(parseFloat(amount)),
          status: 'pending',
          created_at: new Date().toISOString()
        })

      if (error) {
        console.error('Database error:', error)
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'STK push sent successfully',
          checkout_request_id: stkData.CheckoutRequestID,
          merchant_request_id: stkData.MerchantRequestID,
          customer_message: stkData.CustomerMessage,
          response_code: stkData.ResponseCode
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          error: stkData.errorMessage || stkData.ResponseDescription || 'STK push failed',
          response_code: stkData.ResponseCode,
          details: stkData
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

  } catch (error) {
    console.error('STK Push error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})