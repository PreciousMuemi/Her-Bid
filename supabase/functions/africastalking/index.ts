// AfricasTalking SMS Integration for Her-Bid Platform
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import AfricasTalking from "africastalking"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize AfricasTalking
const initializeAfricasTalking = () => {
  const apiKey = Deno.env.get('AFRICASTALKING_API_KEY')
  const username = Deno.env.get('AFRICASTALKING_USERNAME') || 'sandbox'
  
  if (!apiKey) {
    throw new Error('AfricasTalking API key not configured')
  }
  
  return AfricasTalking({ apiKey, username })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, ...payload } = await req.json()

    switch (action) {
      case 'send_sms':
        return await handleSendSMS(payload)
      case 'send_bulk_sms':
        return await handleBulkSMS(payload)
      case 'check_balance':
        return await handleCheckBalance()
      case 'delivery_report':
        return await handleDeliveryReport(payload)
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action. Supported: send_sms, send_bulk_sms, check_balance, delivery_report' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
    }
  } catch (error) {
    console.error('AfricasTalking function error:', error)
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

async function handleSendSMS(payload: any) {
  const { to, message, from, user_id, notification_type } = payload

  if (!to || !message) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: to, message' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }

  try {
    const africastalking = initializeAfricasTalking()
    const sms = africastalking.SMS

    // Format phone number for Kenya (+254)
    let formattedPhone = to.toString().replace(/\s+/g, '')
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+254' + formattedPhone.slice(1)
    } else if (!formattedPhone.startsWith('+254')) {
      formattedPhone = '+254' + formattedPhone
    }

    const options = {
      to: formattedPhone,
      message: message,
      from: from || undefined, // Use shortCode if provided
    }

    const result = await sms.send(options)
    
    // Store SMS log in database
    if (user_id) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      await supabase
        .from('sms_logs')
        .insert({
          user_id,
          phone_number: formattedPhone,
          message,
          notification_type: notification_type || 'general',
          status: result.SMSMessageData.Recipients[0].status,
          message_id: result.SMSMessageData.Recipients[0].messageId,
          cost: result.SMSMessageData.Recipients[0].cost,
          created_at: new Date().toISOString()
        })
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: result.SMSMessageData,
        message: 'SMS sent successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('SMS sending error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to send SMS', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

async function handleBulkSMS(payload: any) {
  const { recipients, message, from } = payload

  if (!recipients || !Array.isArray(recipients) || !message) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: recipients (array), message' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }

  try {
    const africastalking = initializeAfricasTalking()
    const sms = africastalking.SMS

    // Format phone numbers
    const formattedRecipients = recipients.map(phone => {
      let formatted = phone.toString().replace(/\s+/g, '')
      if (formatted.startsWith('0')) {
        formatted = '+254' + formatted.slice(1)
      } else if (!formatted.startsWith('+254')) {
        formatted = '+254' + formatted
      }
      return formatted
    })

    const options = {
      to: formattedRecipients,
      message: message,
      from: from || undefined,
    }

    const result = await sms.send(options)

    return new Response(
      JSON.stringify({
        success: true,
        data: result.SMSMessageData,
        message: 'Bulk SMS sent successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Bulk SMS error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to send bulk SMS', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

async function handleCheckBalance() {
  try {
    const africastalking = initializeAfricasTalking()
    const application = africastalking.APPLICATION

    const result = await application.fetchApplicationData()

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
        message: 'Balance retrieved successfully'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Balance check error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to check balance', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

async function handleDeliveryReport(payload: any) {
  const { id, status, networkCode, failureReason } = payload

  if (!id) {
    return new Response(
      JSON.stringify({ error: 'Missing message ID' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }

  try {
    // Update SMS log with delivery status
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error } = await supabase
      .from('sms_logs')
      .update({
        delivery_status: status,
        network_code: networkCode,
        failure_reason: failureReason,
        delivered_at: status === 'Success' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('message_id', id)

    if (error) {
      console.error('Database update error:', error)
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Delivery report processed'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Delivery report error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to process delivery report', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/africastalking' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
