# Her-Bid Supabase Integration Guide

This guide covers the complete setup and deployment of Supabase functions and database schema for the Her-Bid platform.

## 🚀 Quick Setup

### 1. Prerequisites

- Node.js (v18+)
- Supabase CLI access via npx
- M-Pesa API credentials (for payments)
- AfricasTalking API credentials (for SMS)

### 2. Initialize Supabase (Already Done)

```bash
npx supabase@latest login
npx supabase@latest init
npx supabase@latest link --project-ref YOUR_PROJECT_REF
```

### 3. Deploy Everything

```bash
# Deploy all functions and database schema
./deploy_supabase.sh

# Set up environment variables
./setup_env_vars.sh
```

## 📋 Manual Deployment Steps

### Database Schema

```bash
# Apply the database schema
npx supabase@latest db push
```

### Deploy Functions

```bash
# Deploy individual functions
npx supabase@latest functions deploy mpesa-stk-push
npx supabase@latest functions deploy mpesa-callback
npx supabase@latest functions deploy africastalking
```

### Environment Variables

Set these in your Supabase project dashboard or using the CLI:

#### M-Pesa Configuration

```bash
npx supabase@latest secrets set MPESA_CONSUMER_KEY="your_consumer_key"
npx supabase@latest secrets set MPESA_CONSUMER_SECRET="your_consumer_secret"
npx supabase@latest secrets set MPESA_SHORTCODE="your_shortcode"
npx supabase@latest secrets set MPESA_PASSKEY="your_passkey"
npx supabase@latest secrets set MPESA_ENVIRONMENT="sandbox" # or "production"
```

#### AfricasTalking Configuration

```bash
npx supabase@latest secrets set AFRICASTALKING_API_KEY="your_api_key"
npx supabase@latest secrets set AFRICASTALKING_USERNAME="your_username" # default: "sandbox"
```

## 🧪 Testing the Functions

### M-Pesa STK Push

```bash
curl -X POST "https://your-project.supabase.co/functions/v1/mpesa-stk-push" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "phone_number": "254712345678",
    "amount": 100,
    "order_id": "test-order-123",
    "account_reference": "HerBid-Project-456"
  }'
```

### AfricasTalking SMS

```bash
# Send SMS
curl -X POST "https://your-project.supabase.co/functions/v1/africastalking" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "send_sms",
    "to": "254712345678",
    "message": "Welcome to Her-Bid! Your account is ready.",
    "user_id": "user123",
    "notification_type": "welcome"
  }'

# Check balance
curl -X POST "https://your-project.supabase.co/functions/v1/africastalking" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "check_balance"
  }'

# Send bulk SMS
curl -X POST "https://your-project.supabase.co/functions/v1/africastalking" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "send_bulk_sms",
    "recipients": ["254712345678", "254798765432"],
    "message": "Her-Bid platform maintenance scheduled for tonight."
  }'
```

## 📊 Database Tables

The schema includes these main tables:

### Core Tables

- `users` - User profiles and information
- `projects` - Project details and status
- `project_milestones` - Project milestones and completion tracking
- `milestone_payments` - Payment distribution to team members

### Payment & Communication Tables

- `mpesa_transactions` - M-Pesa payment tracking
- `escrow_details` - Project escrow management
- `sms_logs` - SMS notification logging

## 🔧 Function Capabilities

### M-Pesa STK Push (`mpesa-stk-push`)

- Initiates M-Pesa payments
- Validates payment requests
- Stores transaction records
- Returns payment status

### M-Pesa Callback (`mpesa-callback`)

- Handles M-Pesa payment confirmations
- Updates transaction status
- Manages escrow status

### AfricasTalking SMS (`africastalking`)

- Send single SMS
- Send bulk SMS
- Check account balance
- Handle delivery reports
- Log all SMS activity

## 🛠️ Integration with Frontend

### M-Pesa Payment Integration

```typescript
// In your React components
const initiatePayment = async (
  amount: number,
  phoneNumber: string,
  orderId: string
) => {
  const response = await fetch("/functions/v1/mpesa-stk-push", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone_number: phoneNumber,
      amount: amount,
      order_id: orderId,
      account_reference: `HerBid-${orderId}`,
    }),
  });

  const result = await response.json();
  return result;
};
```

### SMS Notifications

```typescript
// Send SMS notification
const sendSMSNotification = async (
  phoneNumber: string,
  message: string,
  userId?: string
) => {
  const response = await fetch("/functions/v1/africastalking", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "send_sms",
      to: phoneNumber,
      message: message,
      user_id: userId,
      notification_type: "project_update",
    }),
  });

  const result = await response.json();
  return result;
};
```

## 🔒 Security Considerations

1. **Environment Variables**: Never expose API keys in frontend code
2. **Row Level Security**: Enabled on all tables with permissive policies (update as needed)
3. **CORS**: Configured to allow requests from your domain
4. **Validation**: All functions include input validation
5. **Error Handling**: Comprehensive error handling and logging

## 📈 Monitoring & Logging

- Check function logs: `npx supabase@latest functions logs FUNCTION_NAME`
- Monitor SMS delivery in `sms_logs` table
- Track M-Pesa transactions in `mpesa_transactions` table
- Use Supabase dashboard for real-time monitoring

## 🚨 Troubleshooting

### Common Issues

1. **Function Deployment Fails**

   - Check if you're in the project root directory
   - Verify Supabase CLI is linked to correct project
   - Ensure all imports are valid

2. **M-Pesa Integration Issues**

   - Verify all environment variables are set
   - Check phone number format (254XXXXXXXX)
   - Confirm shortcode and passkey are correct

3. **SMS Sending Fails**

   - Verify AfricasTalking API key and username
   - Check phone number format
   - Ensure sufficient balance in AfricasTalking account

4. **Database Connection Issues**
   - Verify database password is correct
   - Check if tables exist: `npx supabase@latest db status`
   - Apply schema if needed: `npx supabase@latest db push`

### Getting Help

- Check Supabase logs: `npx supabase@latest logs`
- Review function logs for specific errors
- Verify environment variables: `npx supabase@latest secrets list`

## 🎯 Next Steps

1. **Production Setup**

   - Update M-Pesa environment to "production"
   - Configure production AfricasTalking account
   - Set up proper domain for callbacks

2. **Enhanced Security**

   - Implement proper RLS policies
   - Add API rate limiting
   - Configure webhook authentication

3. **Monitoring**

   - Set up alerts for failed payments
   - Monitor SMS delivery rates
   - Track function performance

4. **Testing**
   - Create comprehensive test suite
   - Set up staging environment
   - Implement end-to-end testing

---

**Happy coding! 🚀**
