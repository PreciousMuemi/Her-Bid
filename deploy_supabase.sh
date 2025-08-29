#!/bin/bash

# Her-Bid Supabase Deployment Script
echo "🚀 Deploying Her-Bid Supabase Functions and Database Schema..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "supabase/config.toml" ]; then
    print_error "This script must be run from the Her-Bid project root directory"
    exit 1
fi

# Step 1: Apply database schema
print_status "Applying database schema..."
npx supabase@latest db push

if [ $? -eq 0 ]; then
    print_status "✅ Database schema applied successfully"
else
    print_error "❌ Failed to apply database schema"
    exit 1
fi

# Step 2: Deploy M-Pesa STK Push function
print_status "Deploying M-Pesa STK Push function..."
npx supabase@latest functions deploy mpesa-stk-push

if [ $? -eq 0 ]; then
    print_status "✅ M-Pesa STK Push function deployed successfully"
else
    print_warning "⚠️  M-Pesa STK Push function deployment failed"
fi

# Step 3: Deploy M-Pesa Callback function
print_status "Deploying M-Pesa Callback function..."
npx supabase@latest functions deploy mpesa-callback

if [ $? -eq 0 ]; then
    print_status "✅ M-Pesa Callback function deployed successfully"
else
    print_warning "⚠️  M-Pesa Callback function deployment failed"
fi

# Step 4: Deploy AfricasTalking SMS function
print_status "Deploying AfricasTalking SMS function..."
npx supabase@latest functions deploy africastalking

if [ $? -eq 0 ]; then
    print_status "✅ AfricasTalking SMS function deployed successfully"
else
    print_warning "⚠️  AfricasTalking SMS function deployment failed"
fi

# Step 5: Set up environment variables reminder
print_status "📋 Environment Variables Checklist:"
echo ""
echo "Make sure to set these environment variables in your Supabase project:"
echo ""
echo "🔹 M-Pesa Configuration:"
echo "   - MPESA_CONSUMER_KEY"
echo "   - MPESA_CONSUMER_SECRET"
echo "   - MPESA_SHORTCODE"
echo "   - MPESA_PASSKEY"
echo "   - MPESA_ENVIRONMENT (sandbox/production)"
echo ""
echo "🔹 AfricasTalking Configuration:"
echo "   - AFRICASTALKING_API_KEY"
echo "   - AFRICASTALKING_USERNAME"
echo ""
echo "🔹 Supabase Configuration (auto-set):"
echo "   - SUPABASE_URL"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo ""

# Step 6: Test functions
print_status "🧪 Testing function endpoints..."
echo ""
echo "You can test your functions using these URLs:"
echo ""
echo "🔸 M-Pesa STK Push:"
echo "   POST https://your-project.supabase.co/functions/v1/mpesa-stk-push"
echo "   Body: {\"phone_number\": \"0712345678\", \"amount\": 100, \"order_id\": \"test-123\"}"
echo ""
echo "🔸 AfricasTalking SMS:"
echo "   POST https://your-project.supabase.co/functions/v1/africastalking"
echo "   Body: {\"action\": \"send_sms\", \"to\": \"0712345678\", \"message\": \"Hello from Her-Bid!\"}"
echo ""
echo "🔸 Check Balance:"
echo "   POST https://your-project.supabase.co/functions/v1/africastalking"
echo "   Body: {\"action\": \"check_balance\"}"
echo ""

print_status "🎉 Deployment completed! Check the output above for any warnings or errors."
print_status "💡 Don't forget to configure your environment variables in the Supabase dashboard."
