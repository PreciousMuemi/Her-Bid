// Her-Bid USSD Interface for Non-Digital Users
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { sessionId, phoneNumber, text } = await req.json()

    if (!phoneNumber) {
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const response = await handleUSSDSession(sessionId, phoneNumber, text)

    return new Response(
      response,
      { 
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' } 
      }
    )
  } catch (error) {
    console.error('USSD error:', error)
    return new Response(
      'END Service temporarily unavailable. Please try again later.',
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' } 
      }
    )
  }
})

async function handleUSSDSession(sessionId: string, phoneNumber: string, text: string): Promise<string> {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Format phone number
  let formattedPhone = phoneNumber.toString().replace(/\s+/g, '')
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '254' + formattedPhone.slice(1)
  } else if (!formattedPhone.startsWith('254')) {
    formattedPhone = '254' + formattedPhone
  }

  if (text === "") {
    // Main menu
    return `CON Welcome to Her-Bid 🚀
1. Check Balance
2. View Active Projects
3. Confirm Job Completion
4. View Payment History
5. Get Support
0. Exit`
  }

  if (text === "1") {
    // Check balance
    try {
      const { data: user } = await supabase
        .from('users')
        .select('total_earnings, projects_completed')
        .eq('phone', formattedPhone)
        .single()

      if (user) {
        return `END Your Her-Bid Stats:
💰 Total Earnings: KES ${user.total_earnings || 0}
✅ Projects Completed: ${user.projects_completed || 0}

Payments are sent directly to your M-Pesa account.`
      } else {
        return `END Phone number not registered.
Please sign up on the Her-Bid app first.`
      }
    } catch (error) {
      return `END Unable to retrieve balance.
Please try again later.`
    }
  }

  if (text === "2") {
    // View active projects
    try {
      const { data: projects } = await supabase
        .from('projects')
        .select('id, title, status, budget')
        .contains('team_members', [{ phone: formattedPhone }])
        .in('status', ['open', 'in_progress'])
        .limit(5)

      if (projects && projects.length > 0) {
        let response = `CON Your Active Projects:\n`
        projects.forEach((project, index) => {
          response += `${index + 1}. ${project.title.substring(0, 25)}${project.title.length > 25 ? '...' : ''}\n`
          response += `   Status: ${project.status}\n`
          response += `   Budget: KES ${project.budget}\n`
        })
        response += `\n0. Back to main menu`
        return response
      } else {
        return `END No active projects found.
Visit the Her-Bid app to find new opportunities!`
      }
    } catch (error) {
      return `END Unable to retrieve projects.
Please try again later.`
    }
  }

  if (text === "3") {
    // Confirm job completion menu
    try {
      const { data: projects } = await supabase
        .from('projects')
        .select('id, title')
        .contains('team_members', [{ phone: formattedPhone }])
        .eq('status', 'in_progress')
        .limit(5)

      if (projects && projects.length > 0) {
        let response = `CON Select project to confirm completion:\n`
        projects.forEach((project, index) => {
          response += `${index + 1}. ${project.title.substring(0, 30)}${project.title.length > 30 ? '...' : ''}\n`
        })
        response += `\n0. Back to main menu`
        return response
      } else {
        return `END No active projects to confirm.
Complete projects will show here.`
      }
    } catch (error) {
      return `END Unable to retrieve projects.
Please try again later.`
    }
  }

  if (text.startsWith("3*")) {
    // Process job completion confirmation
    const parts = text.split("*")
    const projectIndex = parseInt(parts[1]) - 1

    try {
      const { data: projects } = await supabase
        .from('projects')
        .select('id, title')
        .contains('team_members', [{ phone: formattedPhone }])
        .eq('status', 'in_progress')
        .limit(5)

      if (projects && projects[projectIndex]) {
        const project = projects[projectIndex]
        
        // Create a milestone completion record
        await supabase
          .from('project_milestones')
          .insert({
            project_id: project.id,
            description: 'Job completion confirmed via USSD',
            percentage: 100,
            status: 'completed',
            confirmed_by: formattedPhone,
            completed_at: new Date().toISOString()
          })

        // Update project status
        await supabase
          .from('projects')
          .update({ status: 'completed' })
          .eq('id', project.id)

        return `END ✅ Job completion confirmed!
Project: ${project.title}

Client will be notified via SMS.
Payment will be processed soon.`
      } else {
        return `END Invalid selection.
Please try again.`
      }
    } catch (error) {
      return `END Unable to confirm completion.
Please try again later.`
    }
  }

  if (text === "4") {
    // View payment history
    try {
      const { data: payments } = await supabase
        .from('milestone_payments')
        .select('amount, status, created_at')
        .eq('phone', formattedPhone)
        .order('created_at', { ascending: false })
        .limit(5)

      if (payments && payments.length > 0) {
        let response = `CON Recent Payments:\n`
        payments.forEach((payment, index) => {
          const date = new Date(payment.created_at).toLocaleDateString()
          response += `${index + 1}. KES ${payment.amount} - ${payment.status}\n`
          response += `   Date: ${date}\n`
        })
        response += `\n0. Back to main menu`
        return response
      } else {
        return `END No payment history found.
Complete projects to start earning!`
      }
    } catch (error) {
      return `END Unable to retrieve payment history.
Please try again later.`
    }
  }

  if (text === "5") {
    // Get support
    return `END Her-Bid Support 📞

📱 WhatsApp: +254700000000
📧 Email: support@herbid.co.ke
🌐 Website: www.herbid.co.ke

For urgent issues, call our helpline.`
  }

  if (text === "0") {
    // Exit
    return `END Thank you for using Her-Bid! 🚀

Download our app for full features:
- Real-time notifications
- Advanced project management
- Instant payments

Stay connected, stay earning! 💰`
  }

  // Handle navigation back to main menu
  if (text.endsWith("*0")) {
    return `CON Welcome to Her-Bid 🚀
1. Check Balance
2. View Active Projects
3. Confirm Job Completion
4. View Payment History
5. Get Support
0. Exit`
  }

  // Default response for invalid input
  return `CON Invalid input. Please try again.

1. Check Balance
2. View Active Projects
3. Confirm Job Completion
4. View Payment History
5. Get Support
0. Exit`
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/ussd' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
