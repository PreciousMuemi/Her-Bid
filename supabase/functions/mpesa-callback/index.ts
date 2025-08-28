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
    const body = await req.json()
    const { Body } = body
    const { stkCallback } = Body

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const checkoutRequestId = stkCallback.CheckoutRequestID
    const resultCode = stkCallback.ResultCode

    if (resultCode === 0) {
      // Payment successful
      const callbackMetadata = stkCallback.CallbackMetadata
      const items = callbackMetadata.Item

      const receiptNumber = items.find(item => item.Name === 'MpesaReceiptNumber')?.Value
      const transactionDate = items.find(item => item.Name === 'TransactionDate')?.Value
      const phoneNumber = items.find(item => item.Name === 'PhoneNumber')?.Value

      // Update transaction status
      await supabase
        .from('mpesa_transactions')
        .update({
          status: 'completed',
          mpesa_receipt_number: receiptNumber,
          transaction_date: transactionDate,
          updated_at: new Date().toISOString()
        })
        .eq('checkout_request_id', checkoutRequestId)

      // Update project escrow status
      const { data: transaction } = await supabase
        .from('mpesa_transactions')
        .select('*')
        .eq('checkout_request_id', checkoutRequestId)
        .single()

      if (transaction) {
        await supabase
          .from('projects')
          .update({
            funds_status: 'secured',
            escrow_amount: transaction.amount
          })
          .eq('id', transaction.account_reference)
      }

    } else {
      // Payment failed
      await supabase
        .from('mpesa_transactions')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('checkout_request_id', checkoutRequestId)
    }

    return new Response(JSON.stringify({ 
      ResultCode: 0, 
      ResultDesc: 'Success' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Callback error:', error)
    return new Response(JSON.stringify({ 
      ResultCode: 1, 
      ResultDesc: 'Error' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
